/*
 * emulatedterminal.js
 *
 * Copyright (c) 2013 Chloride Cull. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */

var EmulatedTerminal = new Array();

(function() {
var etermset = new Array();
var previouslines = new Array();
previouslines[0] = new Array(); //lines
previouslines[1] = 0; //currentline
previouslines[2] = 0; //maxlines

function elemKeyPress(event)
{
	if (event.which == 13) //enter
	{
		var tmp = etermset.whichEntity.children["inputline"].innerHTML;
		previouslines[0].push(tmp);
		previouslines[2] = previouslines[2] + 1;
		previouslines[1] = previouslines[2];
		EmulatedTerminal.WriteTerminalLine(tmp);
		processLine(etermset.whichEntity.children["inputline"].innerHTML.substring(etermset.pathline.length));
		etermset.whichEntity.children["inputline"].innerHTML = etermset.pathline;
		etermset.whichEntity.children["inputline"].scrollIntoView();
	}
	else
	{
		var input = String.fromCharCode(event.which);
		etermset.whichEntity.children["inputline"].innerHTML += input;
	}
}

function elemKeyDown(event)
{
	if (event.which == 8) //backspace
	{
		if (etermset.whichEntity.children["inputline"].innerHTML.length != etermset.pathline.length)
		{
			etermset.whichEntity.children["inputline"].innerHTML = etermset.whichEntity.children["inputline"].innerHTML.substring(0, etermset.whichEntity.children["inputline"].innerHTML.length - 1);
		}
		return false;
	}
	else if (event.which == 38) //up
	{
		if (previouslines[1] > 0)
		{
			previouslines[1] = previouslines[1] - 1;
			etermset.whichEntity.children["inputline"].innerHTML = previouslines[0][previouslines[1]];
		}
		return false;
	}
	else if (event.which == 40) //down
	{
		if (previouslines[1] < (previouslines[2] - 1))
		{
			console.log(true);
			previouslines[1] = previouslines[1] + 1;
			etermset.whichEntity.children["inputline"].innerHTML = previouslines[0][previouslines[1]];
		}
		return false;
	}
}

function processLine(line)
{
	var command = line.split(" ")[0];
	var fileid = etermset.filesindex[command];
	console.log(etermset.files[fileid]);
	if (etermset.files[fileid] != null && etermset.files[fileid][0] == "bin")
	{
		etermset.files[fileid][2](line.substring(command.length, line.length).trim());
	}
	else
	{
		EmulatedTerminal.WriteTerminalLine(command + ": command not found");
	}
}

function addtointernalfs(zero, one, two)
{
	var tmp = new Array();
	tmp[0] = zero;
	tmp[1] = one;
	tmp[2] = two;
	etermset.files.push(tmp);
	etermset.filesindex[one] = etermset.files.indexOf(tmp);
}

EmulatedTerminal.WriteTerminalLine = function(ToWrite)
{
	var endline = "<span id=\"inputline\">" + etermset.whichEntity.children["inputline"].innerHTML + "</span>";
	etermset.whichEntity.innerHTML = etermset.whichEntity.innerHTML.substring(0, etermset.whichEntity.innerHTML.length - endline.length);
	etermset.whichEntity.innerHTML = etermset.whichEntity.innerHTML + ToWrite + "<br />" + endline;
}

EmulatedTerminal.AddTerminalCommand = function(name, func)
{
	addtointernalfs("bin", name, func);
}

EmulatedTerminal.SetTerminalFile = function(name, contents)
{
	addtointernalfs("txt", name, contents);
}

EmulatedTerminal.ReadTerminalFile = function(name)
{
	if (etermset.files[etermset.filesindex[name]] != null && etermset.files[etermset.filesindex[name]][0] == "txt")
	{
		return etermset.files[etermset.filesindex[name]][2];
	}
	return null;
}

function addBasicCommands()
{
	EmulatedTerminal.AddTerminalCommand("uname", function(argstring) {
			EmulatedTerminal.WriteTerminalLine("EmulatedTerminal " + etermset.hostname + " 1.1.0-github JavaScript CC/EmulatedTerminal");
		});
	EmulatedTerminal.AddTerminalCommand("echo", function(argstring) {
			EmulatedTerminal.WriteTerminalLine(argstring);
		});
	EmulatedTerminal.AddTerminalCommand("clear", function(argstring) {
			etermset.whichEntity.innerHTML = "<span id=\"inputline\">" + etermset.pathline + "</span>";
		});
	EmulatedTerminal.AddTerminalCommand("ls", function(argstring) {
			var tmp = "";
			for (var i = 0; i < etermset.files.length; i++)
			{
				if ((etermset.files[i][1].indexOf(".") == 0 && argstring.indexOf("-l") != -1) || etermset.files[i][1].indexOf(".") != 0)
				{
					if (etermset.files[i][0] == "bin")
					{
						tmp = tmp + "<span style=\"color: #A0F59D\">";
					}
					else if (etermset.files[i][0] == "txt")
					{
						tmp = tmp + "<span style=\"color: #FFF\">";
					}
					tmp = tmp + etermset.files[i][1] + "</span> ";
				}
			}
			EmulatedTerminal.WriteTerminalLine(tmp);
		});
	EmulatedTerminal.AddTerminalCommand("cat", function(argstring) {
			var tmp = EmulatedTerminal.ReadTerminalFile(argstring);
			if (tmp != null)
			{
				EmulatedTerminal.WriteTerminalLine(tmp);
			}
			else
			{
				EmulatedTerminal.WriteTerminalLine("File \"" + argstring + "\" either doesn't exist or isn't a plaintext file.");
			}
		});
	EmulatedTerminal.AddTerminalCommand("su", function(argstring) {
			etermset.username = argstring;
			var pathline = etermset.username + "@" + etermset.hostname + ":" + etermset.currentpath;
			if (etermset.username == "root")
			{
				pathline += "# ";
			}
			else
			{
				pathline += "$ ";
			}
			etermset.pathline = pathline;
		});
	////////////////////////////////////////
	EmulatedTerminal.SetTerminalFile("credits", "Made by Chloride Cull one dark night in 2013...<br />Available on <a href=\"https://github.com/ChlorideCull/EmulatedTerminalJS\">GitHub</a>.<br />Released under the MIT License.");
}

EmulatedTerminal.CreateTerminal = function(WhichEntity, Username, CurrentPath)
{
	etermset.whichEntity = WhichEntity; //Which entity that should act as a terminal.
	etermset.username = Username; //Which username to pretend to be.
	if (window.location.hostname == "")
	{
		etermset.hostname = "localhost";
	}
	else
	{
		etermset.hostname = window.location.hostname;
	}
	etermset.currentpath = CurrentPath; //Which the current path is supposed to be.
	etermset.files = new Array();
	etermset.filesindex = new Array();
	addBasicCommands();
	var pathline = etermset.username + "@" + etermset.hostname + ":" + etermset.currentpath;
	if (etermset.username == "root")
	{
		pathline += "# ";
	}
	else
	{
		pathline += "$ ";
	}
	etermset.pathline = pathline;
	
	etermset.whichEntity.innerHTML = etermset.whichEntity.innerHTML + "<span id=\"inputline\">" + etermset.pathline + "</span>";
	etermset.whichEntity.onkeypress = elemKeyPress;
	etermset.whichEntity.onkeydown = elemKeyDown;
}
})();