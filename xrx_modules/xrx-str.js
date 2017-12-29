"use strict";

function strClean(s) {
	if (!s)
		return  "";
	else
	{
		var s1 = "";
		s1 = s.replace(/'/g, "''");
	    return s1.trim();
	}
}

function strQuote(s) {
	if (!s)
		return  " null ";
	else
	{
		var s1 = "";
		s1 = s.replace(/'/g, "''");
	    return " '" + s1.trim() + "' ";
	}
}

function strQuoteComma(s) {
	if (!s)
		return " null, ";
	else
	{
		var s1 = ""
		s1 = s.replace(/'/g, "''");
	    return " '" + s1.trim() + "', ";
	}
}

function intQuote(s) {
	if (!s)
		return " null ";
	else if (s == -32767)
		return " null ";
	else
	    return " " + s + " ";
}

function intQuoteComma(s) {
	if (!s)
		return " null, ";
	else if (s == -32767)
		return " null, ";
	else
	    return " " + s + ", ";
}

function bolQuoteComma(s) {
	if (!s)
		return " null, ";
	else if (s == true)
    	return " 1, ";
    else
    	return " 0, ";
}

function floatQuoteComma(s) {
	if (!s)
		return " null, ";
	else
	    return " " + s + ", ";
}

function datQuote(s) {
    if (!s)
        return " null ";
    else
        return " '" + s + "' ";
}

function datQuoteComma(s) {
	if (!s)
		return " null, ";
	else
		return " '" + s + "', ";
}

module.exports.strClean = strClean;
module.exports.strQuote = strQuote;
module.exports.intQuote= intQuote;
module.exports.strQuoteComma = strQuoteComma;
module.exports.intQuoteComma = intQuoteComma;
module.exports.bolQuoteComma = bolQuoteComma;
module.exports.floatQuoteComma = floatQuoteComma;
module.exports.datQuote = datQuote;
module.exports.datQuoteComma = datQuoteComma;
