"use strict";

/*
 * Created with @iobroker/create-adapter v1.29.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const { debug } = require("console");
const axios = require("axios").default;
const xml2js = require("xml2js");

// Load your modules here, e.g.:
// const fs = require("fs");

class FrontierSilicon extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: "frontier_silicon",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here

		// Reset the connection indicator during startup
		this.setState("info.connection", false, true);

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		this.log.info("config option1: " + this.config.PIN);
		this.log.info("config IP: " + this.config.IP);

		await this.getDeviceInfo();
		//await this.createSession();
		await this.discoverState();
		await this.discoverDeviceFeatures();
		await this.getModePresets();
		// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
		//this.subscribeStates("testVariable");
		// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
		// this.subscribeStates("lights.*");
		// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
		this.subscribeStates("device.*");
		this.subscribeStates("modes.*.switchTo");
		this.subscribeStates("modes.*.presets.*.recall");

		/*
			setState examples
			you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
		// the variable testVariable is set to true as command (ack=false)
		//await this.setStateAsync("testVariable", true);

		// same thing, but the value is flagged "ack"
		// ack should be always set to true if the value is received from or acknowledged from the target system
		//await this.setStateAsync("testVariable", { val: true, ack: true });

		// same thing, but the state is deleted after 30s (getState will return null afterwards)
		//await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

		// examples for the checkPassword/checkGroup functions
		let result = await this.checkPasswordAsync("admin", "iobroker");
		this.log.info("check user admin pw iobroker: " + result);

		result = await this.checkGroupAsync("admin", "admin");
		this.log.info("check group user admin group admin: " + result);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);

			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  * @param {string} id
	//  * @param {ioBroker.Object | null | undefined} obj
	//  */
	// onObjectChange(id, obj) {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
			//const setState = this.setStateAsync;
			const zustand = id.split(".");

			//let result;
			switch(zustand[2])
			{
				case "device":
					switch(zustand[3])
					{
						case "power":
							this.log.debug("Ein-/Ausschalten");
							//const adapter = this;
							this.callAPI("netRemote.sys.power", state.val ? "1" : "0")
								.then(function (result) {
									if(result.success) {
										//adapter.setStateAsync("device.power", {ack: true});
										state.ack = true;
									}
								});

							if(state.val && this.config.SangeanNoSound)
							{
								this.makeSangeanDABPlay();
							}
							break;
						default:
							break;
					}
					break;
				case "modes":
					// frontier_silicon.0.modes.2.switchTo
					this.log.debug("Modus umschalten");
					this.callAPI("netRemote.sys.mode", zustand[3])
						.then(function (result) {
							if(result.success) {
								//adapter.setStateAsync("device.power", {ack: true});
								state.ack = true;
							}
						});
					// frontier_silicon.1.modes.4.presets.2.recall
					if(zustand.length == 7 && zustand[6] === "recall")
					{
						this.callAPI("netRemote.nav.action.selectPreset", zustand[5])
							.then(function (result) {
								if(result.success) {
									//adapter.setStateAsync("device.power", {ack: true});
									state.ack = true;
								}
							});
					}
					break;
				default:
					break;
			}
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	makeSangeanDABPlay()
	{
		this.sleep(100);
		const adapter = this;
		this.callAPI("netRemote.sys.mode")
			.then(function (result) {
				adapter.getStateAsync(`modes.${result.result.value[0].u32[0]}.id`)
					.then(function (res){
						if(res !== null && res.val !== null && res.val === "DAB")
						{
							adapter.sleep(2000).then(function (){
								adapter.getStateAsync("modes.mediaplayer")
									.then(function (r) {
										adapter.callAPI("netRemote.sys.mode", r.val.toString());
										adapter.sleep(2000).then(function (){
											adapter.callAPI("netRemote.sys.mode", result.result.value[0].u32[0]);
										});
									});
							});
						}
					});
			});

	}

	async discoverDeviceFeatures()
	{
		const result = await this.callAPI("netRemote.sys.caps.validModes", "", -1, 100);

		if(!result.success) return;

		let key = result.result.item[0].$.key;
		let selectable = false;
		let label = "";
		let streamable = false;
		let id = "";

		result.result.item.forEach(item => {
			key = item.$.key;
			item.field.forEach(f => {
				switch (f.$.name) {
					case "id":
						id = f.c8_array[0];
						break;
					case "selectable":
						selectable = f.u8[0] == 1;
						break;
					case "label":
						label = f.c8_array[0];
						break;
					case "streamable":
						streamable = f.u8[0] == 1;
						break;
					default:
						break;
				}
			});
			if (!selectable) return;

			if(id === "MP" && this.config.SangeanNoSound)
			{
				this.setObjectNotExistsAsync(`modes.mediaplayer`, {
					type: "state",
					common: {
						name: "Media Player Mode Key",
						type: "number",
						role: "media.input",
						read: true,
						write: false,
					},
					native: {},
				});
				this.setStateAsync("modes.mediaplayer", { val: key, ack: true });
			}

			this.setObjectNotExistsAsync(`modes.${key}`, {
				type: "channel",
				common: {
					name: label
				},
				native: {},
			});

			this.setObjectNotExistsAsync(`modes.${key}.key`, {
				type: "state",
				common: {
					name: "Mode Key",
					type: "number",
					role: "media.input",
					read: true,
					write: false,
				},
				native: {},
			});
			this.setStateAsync(`modes.${key}.key`, { val: key, ack: true });
			this.setObjectNotExistsAsync(`modes.${key}.id`, {
				type: "state",
				common: {
					name: "Mode ID",
					type: "string",
					role: "text",
					read: true,
					write: false,
				},
				native: {},
			});
			this.setStateAsync(`modes.${key}.id`, { val: id, ack: true });
			this.setObjectNotExistsAsync(`modes.${key}.label`, {
				type: "state",
				common: {
					name: "Mode Label",
					type: "string",
					role: "text",
					read: true,
					write: false,
				},
				native: {},
			});
			this.setStateAsync(`modes.${key}.label`, { val: label, ack: true });
			this.setObjectNotExistsAsync(`modes.${key}.streamable`, {
				type: "state",
				common: {
					name: "Mode Streamable",
					type: "boolean",
					role: "indicator",
					read: true,
					write: false,
				},
				native: {},
			});
			this.setObjectNotExistsAsync(`modes.${key}.switchTo`, {
				type: "state",
				common: {
					name: "Switch to mode",
					type: "boolean",
					role: "button",
					read: false,
					write: true,
				},
				native: {},
			});
			this.setStateAsync(`modes.${key}.streamable`, { val: streamable, ack: true });
			this.log.debug(`ID: ${id} - Selectable: ${selectable} - Label: ${label} - Key: ${key}`);
		});
	}

	async getModePresets()
	{
		this.log.debug("Getting presets");
		let result = await this.callAPI("netRemote.nav.state", "1");
		if(!result.success) return;
		result = await this.callAPI("netRemote.sys.mode");
		const mode = result.result.value[0].u32[0];

		for(let i=0;i<=25;++i)
		{
			this.log.debug("Getting Modes");
			let mode = await this.getStateAsync(`modes.${i}.key`);
			if(mode === null) continue;
			this.log.debug(`Mode ${i}`);

			mode = await this.getStateAsync(`modes.${i}.presets.available`);
			this.log.debug(JSON.stringify(mode));
			if(mode !== null) continue;
			this.log.debug(`Presets ${i}`);

			result = await this.callAPI("netRemote.sys.mode", i.toString());
			await this.sleep(1000);
			result = await this.callAPI("netRemote.nav.state", "1");
			result = await this.callAPI("netRemote.nav.presets", "", -1, 65535);
			//this.log.debug(JSON.stringify(result.result));

			let key = 0;
			let name = "";

			await this.setObjectNotExistsAsync(`modes.${i}.presets`, {
				type: "channel",
				common: {
					name: "Presets"
				},
				native: {},
			});

			//const available = await this.getStateAsync(`modes.${i}.presets.available`);
			await this.setObjectNotExistsAsync(`modes.${i}.presets.available`, {
				type: "state",
				common: {
					name: "Mode Key",
					type: "boolean",
					role: "indicator",
					read: true,
					write: false,
				},
				native: {},
			});
			await this.setStateAsync(`modes.${i}.presets.available`, { val: true, ack: true });
			//this.log.debug(result.success.toString() + " - " + (available !== undefined).toString());
			if(!result.success) continue;

			await this.callAPI("netRemote.sys.audio.mute", "1");
			result.result.item.forEach(item => {
				key = item.$.key;
				item.field.forEach(f => {
					//this.log.debug(key.toString());
					//this.log.debug(JSON.stringify(item));
					//this.log.debug(JSON.stringify(f));
					switch (f.$.name) {
						case "name":
							name = f.c8_array[0];
							break;
						default:
							break;
					}
				});

				this.log.debug(name);
				this.setObjectNotExistsAsync(`modes.${i}.presets.${key}`, {
					type: "channel",
					common: {
						name: `Preset ${key}`
					},
					native: {},
				});
				this.setObjectNotExistsAsync(`modes.${i}.presets.${key}.name`, {
					type: "state",
					common: {
						name: "Preset Name",
						type: "string",
						role: "text",
						read: true,
						write: false,
					},
					native: {},
				});
				this.setStateAsync(`modes.${i}.presets.${key}.name`, { val: name.toString(), ack: true });
				this.setObjectNotExistsAsync(`modes.${i}.presets.${key}.key`, {
					type: "state",
					common: {
						name: "Preset Key",
						type: "number",
						role: "media.playid",
						read: true,
						write: false,
					},
					native: {},
				});
				this.setStateAsync(`modes.${i}.presets.${key}.key`, { val: key, ack: true });
				this.setObjectNotExistsAsync(`modes.${i}.presets.${key}.recall`, {
					type: "state",
					common: {
						name: "Recall Preset",
						type: "boolean",
						role: "button",
						read: false,
						write: true,
					},
					native: {},
				});
			});
		}
		await this.callAPI("netRemote.sys.mode", mode);
		await this.callAPI("netRemote.sys.audio.mute", "0");
	}

	/**
	 * Get state of the device
	 */
	async discoverState()
	{
		//const log = this.log;
		await this.setObjectNotExistsAsync("device.power", {
			type: "state",
			common: {
				name: "Power",
				type: "boolean",
				role: "switch.power",
				read: true,
				write: true,
			},
			native: {},
		});

		let power = await this.callAPI("netRemote.sys.power");
		this.log.debug(JSON.stringify(power));
		if(power.success)
		{
			this.log.debug(`Power: ${power.result.value[0].u8[0] == 1}`);
			await this.setStateAsync("device.power", { val: power.result.value[0].u8[0] == 1, ack: true });
		}

		await this.setObjectNotExistsAsync("modes.selected", {
			type: "state",
			common: {
				name: "Mode",
				type: "number",
				role: "media.input",
				read: true,
				write: true,
			},
			native: {},
		});
		power = await this.callAPI("netRemote.sys.mode");
		if(power.success)
		{
			this.log.debug(`Mode: ${power.result.value[0].u32[0]}`);
			await this.setStateAsync("modes.selected", { val: power.result.value[0].u32[0], ack: true });
		}

		await this.setObjectNotExistsAsync("modes.selectedLabel", {
			type: "state",
			common: {
				name: "Mode",
				type: "string",
				role: "media.input",
				read: true,
				write: true,
			},
			native: {},
		});
		power.value = await this.getStateAsync(`modes.${power.result.value[0].u32[0]}.label`);
		if(power.success && power.value !== null)
		{
			this.log.debug(`Mode: ${power.value.val}`);
			await this.setStateAsync("modes.selectedLabel", { val: power.value.val, ack: true });
		}
	}

	/**
	Get basic device info and FSAPI URL
	*/
	async getDeviceInfo()
	{
		const log = this.log;
		await this.setObjectNotExistsAsync("device.friendlyName", {
			type: "state",
			common: {
				name: "Friendly Name",
				type: "string",
				role: "info.name",
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync("device.webfsapi", {
			type: "state",
			common: {
				name: "Web FSAPI URL",
				type: "string",
				role: "info.address",
				read: true,
				write: false,
			},
			native: {},
		});

		await this.setObjectNotExistsAsync("device.version", {
			type: "state",
			common: {
				name: "SW Version",
				type: "string",
				role: "text",
				read: true,
				write: false,
			},
			native: {},
		});

		const dev = {};

		await axios.get(`http://${this.config.IP}/devices`)
			.then(async device => {
				//log.debug(device.)
				const parser = new xml2js.Parser();
				parser.parseStringPromise(device.data).then(function (result) {
					log.debug(result.netRemote.friendlyName);
					dev.friendlyName = result.netRemote.friendlyName;
					dev.version = result.netRemote.version;
					dev.webfsapi = result.netRemote.webfsapi;
					log.debug("Hallo PARSER");

				})
					.catch(function (err) {
					// Failed});
						log.debug(JSON.stringify(err));
						log.debug("Hallo FEHLER");
					});
			});

		if(dev.friendlyName !== null)
		{
			await this.setStateAsync("device.friendlyName", { val: dev.friendlyName, ack: true });
		}
		if(dev.vesion !== null)
		{
			await this.setStateAsync("device.version", { val: dev.version, ack: true });
		}
		if(dev.webfsapi !== null)
		{
			await this.setStateAsync("device.webfsapi", { val: dev.webfsapi, ack: true });
			this.config.fsAPIURL = dev.webfsapi;
		}
	}

	/**
	 * Call FSAPI
	 * @param {string} command
	 * @param {string} value optional
	 * @param {number} start optional, nur bei Listen, default ist -1
	 * @param {number} maxItems optional, nur bei Listen, default ist 65535
	 */
	async callAPI(command, value = "", start = -65535, maxItems = 65535)
	{
		//const log = this.log;
		let conn = await this.getStateAsync("info.connection");
		const answer = {};
		answer.success = false;

		if(conn !== null && conn !== undefined)
		{
			if(!conn.val || this.config.SessionID === 0 || conn.ts <= Date.now()-15*60*1000)
			{
				await this.createSession();
			}
		}
		else
		{
			await this.createSession();
		}
		conn = await this.getStateAsync("info.connection");
		this.log.debug(JSON.stringify(conn));
		if(conn !== null && conn !== undefined && conn.val)
		{
			let url = "";
			const log = this.log;

			if(command.toUpperCase().startsWith("/FSAPI"))
			{
				command = command.substring(6);
			}
			if(command.toUpperCase().startsWith("/GET") || command.toUpperCase().startsWith("/SET"))
			{
				command = command.substring(5);
			}
			if(command.toUpperCase().startsWith("/LIST_GET_NEXT"))
			{
				command = command.substring(14);
			}

			if(start > - 65535)
			{
				url = `${this.config.fsAPIURL}/LIST_GET_NEXT/${command}/${start}?pin=${this.config.PIN}&sid=${this.config.SessionID}&maxItems=${maxItems}`;
			}
			else if(value !== "")
			{
				url = `${this.config.fsAPIURL}/SET/${command}?pin=${this.config.PIN}&sid=${this.config.SessionID}&value=${value}`;
			}
			else
			{
				url = `${this.config.fsAPIURL}/GET/${command}?pin=${this.config.PIN}&sid=${this.config.SessionID}`;
			}
			this.log.debug(url);
			await axios.get(url)
				.then(async data => {
				//log.debug(device.)
					const parser = new xml2js.Parser();
					parser.parseStringPromise(data.data).then(function (result) {
						log.debug(JSON.stringify(result.fsapiResponse));
						answer.result = result.fsapiResponse;
						answer.success = result.fsapiResponse.status[0].toString() == "FS_OK";
					})
						.catch(function (err) {
							// Failed});
							log.debug(JSON.stringify(err));
							log.error("Parse error");
						});
				})
				.catch(function (error)
				{
					if (error.response)
					{
						log.error("Connection error");
						log.debug(JSON.stringify(error));
					}
				});
		}
		else
		{
			this.log.error("No connection");
		}
		//this.log.debug(JSON.stringify(answer.result));
		return answer;
	}

	async createSession()
	{
		const log = this.log;
		const dev = {};
		log.debug("CreateSession");
		let url;
		let connected = false;
		if(this.config.fsAPIURL !== null)
		{
			url = `${this.config.fsAPIURL}/CREATE_SESSION?pin=${this.config.PIN}`;
			log.debug(url);
			await axios.get(url)
				.then(async device => {
				//log.debug(device.)
					const parser = new xml2js.Parser();
					parser.parseStringPromise(device.data).then(function (result) {
						log.debug(result.fsapiResponse.sessionId);
						dev.Session = result.fsapiResponse.sessionId;
						log.debug("Session created");
						connected = true;
					})
						.catch(function (err) {
							// Failed});
							log.debug(JSON.stringify(err));
							log.debug("No session created");
						});
				})
				.catch(function (error)
				{
					if (error.response)
					{
						log.warn("Falsche PIN?");
						log.warn(JSON.stringify(error));
						return;
					}
				});
			this.config.SessionID = dev.Session;
			//this.config.SessionTS = Date.now();
			await this.setState("info.connection", connected, true);
			await this.sleep(200);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.message" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }


	async sleep(ms)
	{
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

}

// @ts-ignore parent is a valid property on module
if (module.parent) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new FrontierSilicon(options);
} else {
	// otherwise start the instance directly
	new FrontierSilicon();
}
