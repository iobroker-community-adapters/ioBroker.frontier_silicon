
# FSAPI Examples

Read presets  
<http://192.168.178.26/fsapi/LIST_GET_NEXT/netRemote.nav.presets/-1?pin=7389&sid=883168529&maxItems=10>

Nav on  
<http://192.168.178.26/fsapi/SET/netRemote.nav.state?pin=7389&sid=883168529&value=1>

Read modes  
<http://192.168.178.26/fsapi/LIST_GET_NEXT/netRemote.sys.caps.validModes/-1?pin=7389&sid=682647964&maxItems=100>

Read current mode  
<http://192.168.178.26/fsapi/GET/netRemote.sys.mode?pin=7389&sid=682647964>

Search for updates  
<http://192.168.178.26/fsapi/SET/netRemote.sys.isu.control?pin=7389&value=2>

On/Off?  
<http://192.168.178.26/fsapi/GET/netRemote.sys.power?pin=7389&sid=682647964>

Switch On  
<http://192.168.178.26/fsapi/SET/netRemote.sys.power?pin=7389&sid=883168529&value=0>

Other FSAPI documents  
<https://github.com/flammy/fsapi/blob/master/FSAPI.md>
<https://www.niehoff.nl/producthandleiding/PMR4000RMKII-03.pdf>
<https://downloads.biamp.com/assets/docs/default-source/control/apart-pmr4000r-mkii-mkiii-control-command-list.pdf?sfvrsn=13dc3a3e_6&_ga=2.16179958.1900116300.1624008695-122457801.1580652037>
<https://github.com/z1c0/FsApi/blob/master/FsApi/Command.cs>
