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

function elemKeyPress(event)
{
	if (event.which == 13) //enter
	{
		var tmp = etermset.whichEntity.children["inputline"].innerHTML;
		EmulatedTerminal.WriteTerminalLine(tmp);
		processLine(etermset.whichEntity.children["inputline"].innerHTML.substring(etermset.pathline.length));
		etermset.whichEntity.children["inputline"].innerHTML = etermset.pathline;
		etermset.whichEntity.children["inputline"].innerHTML.scrollIntoView();
	}
	else
	{
		var input = String.fromCharCode(event.which);
		etermset.whichEntity.children["inputline"].innerHTML += input;
	}
}

function elemKeyDown(event)
{
	if (event.which == 8)
	{
		if (etermset.whichEntity.children["inputline"].innerHTML.length != etermset.pathline.length)
		{
			etermset.whichEntity.children["inputline"].innerHTML = etermset.whichEntity.children["inputline"].innerHTML.substring(0, etermset.whichEntity.children["inputline"].innerHTML.length - 1);
		}
	}
}

function processLine(line)
{
	var command = line.split(" ")[0];
	if (etermset.validcommands[command] == null)
	{
		EmulatedTerminal.WriteTerminalLine(command + ": command not found");
	}
	else
	{
		etermset.validcommands[command](line.substring(command.length, line.length).trim());
	}
}

EmulatedTerminal.WriteTerminalLine = function(ToWrite)
{
	var endline = "<span id=\"inputline\">" + etermset.whichEntity.children["inputline"].innerHTML + "</span>";
	etermset.whichEntity.innerHTML = etermset.whichEntity.innerHTML.substring(0, etermset.whichEntity.innerHTML.length - endline.length);
	etermset.whichEntity.innerHTML = etermset.whichEntity.innerHTML + ToWrite + "<br />" + endline;
}

EmulatedTerminal.AddTerminalCommand = function(name, func)
{
	etermset.validcommands[name] = func;
}

function addBasicCommands()
{
	EmulatedTerminal.AddTerminalCommand("uname", function(argstring) {
			EmulatedTerminal.WriteTerminalLine("EmulatedTerminal " + etermset.hostname + " 1.0.0-github JavaScript CC/EmulatedTerminal");
		});
	EmulatedTerminal.AddTerminalCommand("echo", function(argstring) {
			EmulatedTerminal.WriteTerminalLine(argstring);
		});
	EmulatedTerminal.AddTerminalCommand("clear", function(argstring) {
			etermset.whichEntity.innerHTML = "<span id=\"inputline\">" + etermset.pathline + "</span>";
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
	EmulatedTerminal.AddTerminalCommand("credits", function(argstring) {
			EmulatedTerminal.WriteTerminalLine("Made by Chloride Cull one dark night in 2013...");
			EmulatedTerminal.WriteTerminalLine("Available on <a href=\"https://github.com/ChlorideCull/EmulatedTerminalJS\">GitHub</a>.");
			EmulatedTerminal.WriteTerminalLine("Released under the MIT License.");
		});
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
	etermset.validcommands = new Array();
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