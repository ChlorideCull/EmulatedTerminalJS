#Chloride Site Generator

This creates a silly sh/bash/dash lookalike, like this (using the Terminus font and custom CSS):
![Screenshot](http://i.imgur.com/dnjqDuT.png)

It's highly extensible, accessed through the functions `AddTerminalCommand`, `CreateTerminal` and `WriteTerminalLine`. They are accessible in the `EmulatedTerminal` table.

##Example script

	function termecho(argstring)
	{
		EmulatedTerminal.WriteTerminalLine(argstring);
	}
	
	EmulatedTerminal.CreateTerminal(document.body, "user", "~");
	EmulatedTerminal.AddTerminalCommand("techo", termecho); //Because echo is already defined by standard

##Caveeats

* Only one terminal per page.
* Not usable in worst browser (IE) because I suck with jQuery and it's different. I assume everyone interested in this doesn't run IE.