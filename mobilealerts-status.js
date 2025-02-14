// ~~~ constants ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var MA10006_TEMPERATURE_INSIDE = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[ C]?<\\/h4>';
var MA10006_TEMPERATURE_OUTSIDE = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[ C]?<\\/h4>';
var MA10006_HUMIDITY_INSIDE = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[%]?<\\/h4>';
var MA10006_HUMIDITY_OUTSIDE = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[%]?<\\/h4>';
var MA10100_TEMPERATURE = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[ C]?<\\/h4>';
var MA10120_TEMPERATURE_INSIDE = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[ C]?<\\/h4>';
var MA10120_TEMPERATURE_OUTSIDE = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[ C]?<\\/h4>';
var MA10200_TEMPERATURE = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[ C]?<\\/h4>';
var MA10200_HUMIDITY = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[%]?<\\/h4>';
var MA10320_TEMPERATURE = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[ C]?<\\/h4>';
var MA10320_TEMPERATURE_CABLE = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[ C]?<\\/h4>';
var MA10320_HUMIDITY = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[%]?<\\/h4>';
var MA10350_TEMPERATURE = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[ C]?<\\/h4>';
var MA10350_HUMIDITY = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[%]?<\\/h4>';
var MA10350_LEAK = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)<\\/h4>';
var MA10650_RAIN = '.*?(<h4>%SERIAL%<\\/h4>)[\\s\\S]*?<h4>(.*?)<\\/h4>[\\s\\S]*?<h4>(.*?) mm<\\/h4>';
var MA10660_WIND = '(<h4>%SERIAL%<\\/h4>)[\\s\\S]*?<h4>(.*?)<\\/h4>[\\s\\S]*?<h4>(.*?) m\\/s<\\/h4>[\\s\\S]*?<h4>(.*?) m\\/s<\\/h4>[\\s\\S]*?<h4>(.*?)<\\/h4>';
var MA10700_TEMPERATURE = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[ C]?<\\/h4>';
var MA10700_TEMPERATURE_CABLE = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[ C]?<\\/h4>';
var MA10700_HUMIDITY = '.*?<h4>%SERIAL%[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<\\/h5>[\\s\\S]*?.*?<h4>(.*?)[%]?<\\/h4>';

module.exports = function(RED) {
	'use strict';

	// ~~~ constructor / destructor ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	function MobileAlerts(myNode)
	{
		RED.nodes.createNode(this, myNode);

		var Platform = this;
		var Loop;
	
		this.mobilealertsid = myNode.mobilealertsid;
		this.interval = parseInt(myNode.interval);

		function publishStates()
		{
			Platform.fetchData('http://measurements.mobile-alerts.eu/Home/SensorsOverview?phoneid=' + Platform.mobilealertsid);
		}

		publishStates();

		Loop = setInterval(function() {
			publishStates();
		}, Platform.interval * 1000);   // trigger every defined secs

		Platform.on("close", function() {
			if (Loop) {
				clearInterval(Loop);
			}
		});
	}

	RED.nodes.registerType('mobilealerts-status', MobileAlerts);

	// ~~~ enums ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	MobileAlerts.prototype.DeviceTypes = { MA10120: 1, MA10100: 2, MA10200: 3, MA10350: 4, MA10700: 6, MA10006: 7, MA10650: 8, MA10320: 9, MA10660: 11 };
	MobileAlerts.prototype.MatchTypes = { Name: 1, Serial: 2 };

	// ~~~ functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	MobileAlerts.prototype.fetchData = function(myURL) {
		var Platform = this;
		var r;

		Platform.log('Fetching Data...');

		require('request')({
			method: 'GET',
			url: myURL,
			headers: {}
		}, function(myError, myResponse) {
			if(myError) {
				Platform.warn('There was an Error requesting initial Data for Sensor-Matching: ' + myError);
			} else {
				Platform.parseSensorData(myResponse.body);
			}
		});
	}
	
	MobileAlerts.prototype.parseSensorData = function(myData)
	{
		var Platform = this;

		var sa;		// sensor array
		var r;		// regex
		var m;		// matches
		var n;		// name
		var s;		// serial
		var t;		// type
		var p;		// payload
		
		Platform.log('Parsing Sensor Data...');

		sa = [];
		r = /.*?sensor-header[\s\S]*?.*?<a href.*?>(.*?)<\/a>[\s\S]*?.*?<h4>(.*?)<\/h4>/gi;
		m = r.exec(myData);
		while(m !== null) {						// get each sensor serial and name
			n = m[Platform.MatchTypes.Name];	// from initial sensor data...
			s = m[Platform.MatchTypes.Serial];
			sa[s] = n;							// ...and add it to sonsor array.
		
			m = r.exec(myData);
		}
		
		for (var s in sa) {						// iterate each sensor.
			p = { name: sa[s], serial: s };
			t = parseInt('0x' + s.substr(0, 2));
			switch (t) {
				case Platform.DeviceTypes.MA10006:
					p.temperature = parseFloat(new RegExp(MA10006_TEMPERATURE_INSIDE.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.humidity = parseFloat(new RegExp(MA10006_HUMIDITY_INSIDE.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.temperature_out = parseFloat(new RegExp(MA10006_TEMPERATURE_OUTSIDE.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.humidity_out = parseFloat(new RegExp(MA10006_HUMIDITY_OUTSIDE.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.active = !isNaN(p.temperature);
					p.active_out = !isNaN(p.temperature_out);
					break;
		
				case Platform.DeviceTypes.MA10120:
					p.temperature = parseFloat(new RegExp(MA10120_TEMPERATURE_INSIDE.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.temperature_out = parseFloat(new RegExp(MA10120_TEMPERATURE_OUTSIDE.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.active = !isNaN(p.temperature);
					p.active_out = !isNaN(p.temperature_out);
					break;
		
				case Platform.DeviceTypes.MA10100:
					p.temperature = parseFloat(new RegExp(MA10100_TEMPERATURE.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.active = !isNaN(p.temperature);
					break;
		
				case Platform.DeviceTypes.MA10200:
					p.temperature = parseFloat(new RegExp(MA10200_TEMPERATURE.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.humidity = parseFloat(new RegExp(MA10200_HUMIDITY.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.active = !isNaN(p.temperature);
					break;
				   
				case Platform.DeviceTypes.MA10320:
					p.temperature = parseFloat(new RegExp(MA10320_TEMPERATURE.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.humidity = parseFloat(new RegExp(MA10320_HUMIDITY.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.temperature_cable = parseFloat(new RegExp(MA10320_TEMPERATURE_CABLE.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.active = !isNaN(p.temperature);
					p.active_cable = !isNaN(p.temperature_cable);
					break;

				case Platform.DeviceTypes.MA10350:
					p.temperature = parseFloat(new RegExp(MA10350_TEMPERATURE.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.humidity = parseFloat(new RegExp(MA10350_HUMIDITY.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.leak = new RegExp(MA10350_LEAK.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1] === 'Trocken' ? 0 : 1;
					p.active = !isNaN(p.temperature);
					p.active_leak = !isNaN(p.leak);
					break;
		
				case Platform.DeviceTypes.MA10650:
					var pa = new RegExp(MA10650_RAIN.replace(/%SERIAL%/gi, s), 'gi').exec(myData);
					p.rain = parseFloat(pa[3].replace(',', '.'));
					p.active = !isNaN(p.rain);
					break;
					
				case Platform.DeviceTypes.MA10660:
					var pa = new RegExp(MA10660_WIND.replace(/%SERIAL%/gi, s), 'gi').exec(myData);
					p.windspeed = parseFloat(pa[3].replace(',', '.'));
					p.squall = parseFloat(pa[4].replace(',', '.'));
					p.winddirection = pa[5];
					p.active = !isNaN(p.windspeed);
					break;

				case Platform.DeviceTypes.MA10700:
					p.temperature = parseFloat(new RegExp(MA10700_TEMPERATURE.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.humidity = parseFloat(new RegExp(MA10700_HUMIDITY.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.temperature_cable = parseFloat(new RegExp(MA10700_TEMPERATURE_CABLE.replace(/%SERIAL%/gi, s), 'gi').exec(myData)[1].replace(',', '.'));
					p.active = !isNaN(p.temperature);
					p.active_cable = !isNaN(p.temperature_cable);
					break;
			}

			Platform.send({ payload: p });
		}
	}
};
