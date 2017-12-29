//
// Dynamsoft JavaScript Library for Basic Initiation of Dynamic Web TWAIN
// More info on DWT: http://www.dynamsoft.com/Products/WebTWAIN_Overview.aspx
//
// Copyright 2015, Dynamsoft Corporation
// Author: Dynamsoft Team
// Version: 11.1
//
/// <reference path="dynamsoft.webtwain.initiate.js" />
var Dynamsoft = Dynamsoft || { WebTwainEnv: {} };

Dynamsoft.WebTwainEnv.AutoLoad = true;
///
Dynamsoft.WebTwainEnv.Containers = [{ContainerId:'dwtcontrolContainer', Width:100, Height:100}];
///
Dynamsoft.WebTwainEnv.ProductKey =  '81A5309404F9E1F529C12F223D65D032E7E2F9902A67B7333C0FAB661C2E64FCCD169F3FB25AD3085CF368FA9C9DCCB011704D077E393F26C8098226268140335F38A268BD828A99866FAB9D690B1FE31668ADD4879A0CD5C0B4087AB181B6C19EC539B14FC5C791744FDF5786B8814E9E';
///Old product Key.
//'01C39AB76DBC22FAEFA3B25FECC3241CB8890E7EE1C6DEE9C8FDF7C6EE131F3D2FC6A53DC60777FB05C97D065817DDC97631BDFC7472B27841233E5D1AEB95382294E34B60392D80F04607279745DBC6D3384A5C66F5F94340E774C2C63B8A776813184F3EE832B8E94A2313BA494DE5E1AD383E580919356EE29618E3B9BA3D253F8F1B62A75AA524D36B120261CB68';
///
Dynamsoft.WebTwainEnv.Trial = false;
///
Dynamsoft.WebTwainEnv.ActiveXInstallWithCAB = false;
///
Dynamsoft.WebTwainEnv.Debug = false; // only for debugger output
///
// Dynamsoft.WebTwainEnv.ResourcesPath = 'Resources';

/// All callbacks are defined in the dynamsoft.webtwain.install.js file, you can customize them.

// Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', function(){
// 		// webtwain has been inited
// });
