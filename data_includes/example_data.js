var REPEATADVICE = true,
    ISLL = true,
    ISINS = true,
    ITEMID = 2,
    userID = 0; // For MTurk, dealt with at the end
/*var ISLL = Math.random()>0.5,
    ISINS = Math.random()>0.5,
    REPEATADVICE = Math.random()>0.5,
    ITEMID = 1+Math.floor(Math.random()*2),
    userID = 0; // For MTurk, dealt with at the end*/

var startTime = Date.now();

//alert(ISLL);
//alert(ISINS);
//alert(REPEATADVICE);
//alert(ITEMID);

// Why not just use "First16" and "Second16"? Aren't <Third, Fourth> and <Fifth, Sixth> the exact same pair? So that I know which block a token was played in for analysis later
var shuffleSequence = seq("FinalScreen");
/*var shuffleSequence = seq("Instructions", randomize("First16"),randomize("Second16"),
                          "ExpItem",randomize("Third16"),randomize("Fourth16"),
                          "DistItem",randomize( "Fifth16"),randomize("Sixth16"),
                          "FinalScreen","amt");
*/
//var shuffleSequence = seq(randomize("First16"),randomize("Second16"),"ExpItem",randomize("Third16"),randomize("Fourth16"),"DistItem",randomize( "Fifth16"),randomize("Sixth16"),"FinalScreen");
//var practiceItemTypes = ["practice"];

var defaults = [
    "LQuestion", {
             as: ["F","J"],
             randomOrder: false,
             showNumbers: false,
             presentHorizontally: true,
             autoFirstChar: true
    },
    "Message", {
        hideProgressBar: true
    }
];


define_ibex_controller({
    name: "Questionnaire",

    jqueryWidget: {
        _init: function () {
            this.options.transfer = null; // Remove 'click to continue message'.         
            this.element.VBox({
                options: this.options,
                triggers: [3],
                children: [
                    "Message", { html: { include: "instrctns_postexpermnt_prequaire_allconds.html"}, transfer: null },
                    "Message", { html: { include: this.options.repeatedadvice }, transfer: null },
                    "Message", { html: { include: this.options.thinkcarefully }, transfer: null },
                    "Form", { html: { include: this.options.questionnaire }}
                ]
            });
        }
    },

    properties: { }
});

define_ibex_controller({
    name: "LexDecision",

    jqueryWidget: {
        _init: function () {
            this.options.transfer = null; // Remove 'click to continue message'.         
            this.element.VBox({
                options: this.options,
                triggers: [1],
                children: [
//                  "Message", { html: '<html><div style="text-align: center; margin:auto;">  <img src="http://files.lab.florianschwarz.net/ibexfiles/LucyCate/mic.png" style="height: 200px; text-align: center;" />  <audio controls autoplay preload="auto" style="display: none;">    <source src="http://files.lab.florianschwarz.net/ibexfiles/LucyCate/LDSF/'+ this.options.word + '.mp3" type="audio/mpeg" />    We are sorry but your system does not support the audio.</audio></div></html>', transfer: null },
                    "Message", { html: '<html><div style="text-align: center; margin:auto;">  <audio controls autoplay preload="auto" style="display: none;">    <source src="http://files.lab.florianschwarz.net/ibexfiles/LucyCate/LDSF/'+ this.options.word + '.mp3" type="audio/mpeg" />    We are sorry but your system does not support the audio.</audio></div></html>', transfer: null },
                    "LQuestion", { q: this.options.word,
                                  hasCorrect: this.options.right,
                                   leftComment: "<b>F</b>: Word",
                                   rightComment: "<b>J</b>: Not a word"}
                ]
            });
        }
    },

    properties: { }
});


var items = [
    
    ["Instructions", "Message", {
        transfer: "click",
        html: {include: "consentform.html"}
    }],

    (ISLL ? // If we are in the LL instructions condition
     
        ["Instructions",
            "Message", {
                html: { include: "llinstructions.html" }
            },
            "Message", {
                html: { include: "audioinstructions.html" },
                transfer: "keypress",
                continueMessage: "Press F or J to continue..."
            }
        ]
        
    : // If we are not in the LL instructions condition
        
        ["Instructions",
            "Message", {
                html: { include: "audioinstructions.html" },
                transfer: "keypress",
                continueMessage: "Press F or J to continue..."
            }
        ]
     
    ), // The closing parenthesis indicates the end of the conditional and the comma indicates separates this item from the next item
    
    
    ["ExpItem",
        "Message",
            (ISINS ? // If we are in the INS condition
             
             {
                 transfer: "keypress",
                 html: {include: (ITEMID == 1 ? "item1_INS_audio.html" : "item2_INS_audio.html") }  // A single line conditional
             }
            
            : // If we are not in the INS condition
              
             {
                 transfer: "keypress",
                 html: {include: (ITEMID == 1 ? "item1_nonINS_audio.html" : "item2_nonINS_audio.html") }
             }
     
            ) // The closing parenthesis indicates the end of the conditional
    ],
    
    ["DistItem",
        "Message", {
            transfer: "keypress",
            html: {include: "distractor_audio.html" }
        }
    ],
    
    ["FinalScreen",
        "DynamicQuestion", {
            
            enabled: false,
            
            answers: {Continue: "Click here to continue."},
            
            /*preAllConds: htmlCodeToDOM({include:"instrctns_postexpermnt_prequaire_allconds.html"}),
            audioPage: htmlCodeToDOM({include:"audiorepeatadvice.html"}),
            repeatedadvice: htmlCodeToDOM({include:
                                           ( REPEATADVICE ? "rptdadvc_form"+ITEMID+"_"+(ISINS ? "INS" : "non-INS")+".html" : "blank.html" )
                                          }),
            thinkcarefully: htmlCodeToDOM({include:
                                           ( ISLL ? "instrctns_postexpermnt2_thnkcrfly.html" : "blank.html" ),
                                          }),
            questionnaire: htmlCodeToDOM({include:"questionform"+ITEMID+".html"}),*/
     
            sequence: [
                
                "<div id='preAllConds'></div>",
                "<div id='audioPage'></div>",
                "<div id='repeatadvice'></div>",
                "<div id='thinkcarefully'></div>",
                "<div id='questionnaire'></div>",
                function(t){ 
                    $("#preAllConds").html(htmlCodeToDOM({include:"instrctns_postexpermnt_prequaire_allconds.html"}));
                    $("#audioPage").html(htmlCodeToDOM({include:"audiorepeatadvice.html"}));
                    $("#repeatedadvice").html(htmlCodeToDOM({include:
                                                             ( REPEATADVICE ? "rptdadvc_form"+ITEMID+"_"+(ISINS ? "INS" : "non-INS")+".html" : "blank.html" )
                                                            }));
                    $("#thinkcarefully").html(htmlCodeToDOM({include:
                                           ( ISLL ? "instrctns_postexpermnt2_thnkcrfly.html" : "blank.html" ),
                                          }));
                    $("#questionnaire").html(htmlCodeToDOM({include:"questionform"+ITEMID+".html"}));
                    
                    $("#thinkcarefully, #questionnaire").css("display", "none");
                },
                function(t){                    
                    t.ArrayOfAnswers = [];
                    
                    t.HasPlayedFile = function() {
                        if (this.id == "aud1") t.aud1played = true;
                        else if (this.id == "aud2") t.aud2played = true;
                        
                        if(t.aud1played && t.aud2played) $("#thinkcarefully, #questionnaire").css("display", "block");
                        
                        t.ArrayOfAnswers.push([
                            ["Event", "Playback Ended"],
                            ["AudioID", this.id],
                            ["Timecode", this.currentTime],
                            ["Time", new Date().now - t.creationTime]
                        ]);
                    }
                    
                    t.ClickOnPlay = function(audio) {
                        t.ArrayOfAnswers.push([
                          ["Event", "Click on audio"],
                          ["ControlID", this.id],
                          ["Timecode", this.currentTime],
                          ["Time", new Date().now - t.creationTime]
                        ]);
                    };
                
                    t.ClickOnRadio = function(radio) {
                        t.ArrayOfAnswers.push([
                          ["Event", "Click on radio"],
                          ["ControlID", this.id],
                          ["Timecode", this.currentTime],
                          ["Time", new Date().now - t.creationTime]
                        ]);
            
                        if ($( "input:checked").length == 5)
                          $(document).append($("<a>Click here to continue.</a>").bind("click", function(){t.finishedCallback(t.ArrayOfAnswers);}));
                    };
                
                    $("#aud1").bind("ended", t.HasPlayedFile);
                    $("#aud2").bind("ended", t.HasPlayedFile);
                    $("#aud1, #aud2").bind("play", t.ClickOnPlay);

                    $("input").bind("click", t.ClickOnRadio);
                
                }
            ]
        }
     ],  

    
    ["FinalScreen",
        "Questionnaire", {
            repeatedadvice: ( REPEATADVICE ? "rptdadvc_form"+ITEMID+"_"+(ISINS ? "INS" : "non-INS")+".html" : "blank.html" ),
            thinkcarefully: ( ISLL ? "instrctns_postexpermnt2_thnkcrfly.html" : "blank.html" ),
            questionnaire: ("questionform"+ITEMID+".html") //"example_form.html"
         }
     
    ],
    // From here on are the items for the embedded lexical decision experiment
    ["First16","LexDecision", {word: "plowl",right: 1}],
    ["First16","LexDecision", {word: "fout",right: 1}],
    ["First16","LexDecision", {word: "slox",right: 1}],
    ["First16","LexDecision", {word: "lub",right: 1}],
    ["First16","LexDecision", {word: "pobd",right: 1}],
    ["First16","LexDecision", {word: "pakth",right: 1}],
    ["First16","LexDecision", {word: "tertz",right: 1}],
    ["First16","LexDecision", {word: "foon",right: 1}],
    ["First16","LexDecision", {word: "smile",right: 0}],
    ["First16","LexDecision", {word: "golf",right: 0}],
    ["First16","LexDecision", {word: "worth",right: 0}],
    ["First16","LexDecision", {word: "duck",right: 0}],
    ["First16","LexDecision", {word: "beat",right: 0}],
    ["First16","LexDecision", {word: "nose",right: 0}],
    ["First16","LexDecision", {word: "loaf",right: 0}],
    ["First16","LexDecision", {word: "wine",right: 0}],
    ["Second16","LexDecision", {word: "naint",right: 1}],
    ["Second16","LexDecision", {word: "dit",right: 1}],
    ["Second16","LexDecision", {word: "groud",right: 1}],
    ["Second16","LexDecision", {word: "geel",right: 1}],
    ["Second16","LexDecision", {word: "petch",right: 1}],
    ["Second16","LexDecision", {word: "vop",right: 1}],
    ["Second16","LexDecision", {word: "hilm",right: 1}],
    ["Second16","LexDecision", {word: "wung",right: 1}],
    ["Second16","LexDecision", {word: "lump",right: 0}],
    ["Second16","LexDecision", {word: "beast",right: 0}],
    ["Second16","LexDecision", {word: "path",right: 0}],
    ["Second16","LexDecision", {word: "pad",right: 0}],
    ["Second16","LexDecision", {word: "sot",right: 0}],
    ["Second16","LexDecision", {word: "face",right: 0}],
    ["Second16","LexDecision", {word: "throat",right: 0}],
    ["Second16","LexDecision", {word: "camp",right: 0}],
    ["Third16","LexDecision", {word: "plowl",right: 1}],
    ["Third16","LexDecision", {word: "fout",right: 1}],
    ["Third16","LexDecision", {word: "slox",right: 1}],
    ["Third16","LexDecision", {word: "lub",right: 1}],
    ["Third16","LexDecision", {word: "pobd",right: 1}],
    ["Third16","LexDecision", {word: "pakth",right: 1}],
    ["Third16","LexDecision", {word: "tertz",right: 1}],
    ["Third16","LexDecision", {word: "foon",right: 1}],
    ["Third16","LexDecision", {word: "smile",right: 0}],
    ["Third16","LexDecision", {word: "golf",right: 0}],
    ["Third16","LexDecision", {word: "worth",right: 0}],
    ["Third16","LexDecision", {word: "duck",right: 0}],
    ["Third16","LexDecision", {word: "beat",right: 0}],
    ["Third16","LexDecision", {word: "nose",right: 0}],
    ["Third16","LexDecision", {word: "loaf",right: 0}],
    ["Third16","LexDecision", {word: "wine",right: 0}],
    ["Fourth16","LexDecision", {word: "naint",right: 1}],
    ["Fourth16","LexDecision", {word: "dit",right: 1}],
    ["Fourth16","LexDecision", {word: "groud",right: 1}],
    ["Fourth16","LexDecision", {word: "geel",right: 1}],
    ["Fourth16","LexDecision", {word: "petch",right: 1}],
    ["Fourth16","LexDecision", {word: "vop",right: 1}],
    ["Fourth16","LexDecision", {word: "hilm",right: 1}],
    ["Fourth16","LexDecision", {word: "wung",right: 1}],
    ["Fourth16","LexDecision", {word: "lump",right: 0}],
    ["Fourth16","LexDecision", {word: "beast",right: 0}],
    ["Fourth16","LexDecision", {word: "path",right: 0}],
    ["Fourth16","LexDecision", {word: "pad",right: 0}],
    ["Fourth16","LexDecision", {word: "sot",right: 0}],
    ["Fourth16","LexDecision", {word: "face",right: 0}],
    ["Fourth16","LexDecision", {word: "throat",right: 0}],
    ["Fourth16","LexDecision", {word: "camp",right: 0}],
    ["Fifth16","LexDecision", {word: "plowl",right: 1}],
    ["Fifth16","LexDecision", {word: "fout",right: 1}],
    ["Fifth16","LexDecision", {word: "slox",right: 1}],
    ["Fifth16","LexDecision", {word: "lub",right: 1}],
    ["Fifth16","LexDecision", {word: "pobd",right: 1}],
    ["Fifth16","LexDecision", {word: "pakth",right: 1}],
    ["Fifth16","LexDecision", {word: "tertz",right: 1}],
    ["Fifth16","LexDecision", {word: "foon",right: 1}],
    ["Fifth16","LexDecision", {word: "smile",right: 0}],
    ["Fifth16","LexDecision", {word: "golf",right: 0}],
    ["Fifth16","LexDecision", {word: "worth",right: 0}],
    ["Fifth16","LexDecision", {word: "duck",right: 0}],
    ["Fifth16","LexDecision", {word: "beat",right: 0}],
    ["Fifth16","LexDecision", {word: "nose",right: 0}],
    ["Fifth16","LexDecision", {word: "loaf",right: 0}],
    ["Fifth16","LexDecision", {word: "wine",right: 0}],
    ["Sixth16","LexDecision", {word: "naint",right: 1}],
    ["Sixth16","LexDecision", {word: "dit",right: 1}],
    ["Sixth16","LexDecision", {word: "groud",right: 1}],
    ["Sixth16","LexDecision", {word: "geel",right: 1}],
    ["Sixth16","LexDecision", {word: "petch",right: 1}],
    ["Sixth16","LexDecision", {word: "vop",right: 1}],
    ["Sixth16","LexDecision", {word: "hilm",right: 1}],
    ["Sixth16","LexDecision", {word: "wung",right: 1}],
    ["Sixth16","LexDecision", {word: "lump",right: 0}],
    ["Sixth16","LexDecision", {word: "beast",right: 0}],
    ["Sixth16","LexDecision", {word: "path",right: 0}],
    ["Sixth16","LexDecision", {word: "pad",right: 0}],
    ["Sixth16","LexDecision", {word: "sot",right: 0}],
    ["Sixth16","LexDecision", {word: "face",right: 0}],
    ["Sixth16","LexDecision", {word: "throat",right: 0}],
    ["Sixth16","LexDecision", {word: "camp",right: 0}],
    
    // Handling MTurk
    ["amt", "Form", {
        html: {include: "amt_form.html"}
    }],
    
    ["amt", "__SendResults__", {
       manualSendResults: true,
       sendingResultsMessage: "Please wait while your answers are being saved.",
       completionMessage: "Your answers have successfully being saved!"
    }],
    
    ["amt", "Message", {
        transfer: null,
        html: {include: "confirmation.html"}
    }]
];