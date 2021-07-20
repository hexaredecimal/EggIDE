
//load the backend 
app.LoadScript( "lexer.js"  );

//for switching states
//between IDE and console 
isDebug = false ;


//Called when application is started.
function OnStart()
{

 app.EnableBackKey( false );
	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "linear", "VCenter,FillXY" );	
  
  //create the command line 
  //but don't show it
      createDlg();
   
	//Create a text label and add it to layout.
   code = app.CreateCodeEdit(1,1);
   code.SetTextSize(10);
   code.SetNavigationMethod( "Yoyo" );
   code.SetLanguage(".js");
   lay.AddChild(code);
	   
	//Add layout to app.	
	app.AddLayout( lay );
	
	//create the floating menu button
	//create it above the IDE
		create_menu();
}


// call when the back key is pressed
function OnBack()
{ 
//  app.ShowPopup( "Called"  );
	 if ( isDebug) {
	     isDebug = false ;
	 }
	 
}

// the main compiler entry function
//it is called by the run button 
  function cmpl(){
      //if the command line is not open yet open it
        if( !isDebug )
        {
	            try{
	               //we use a try block to catch 
	               //syntax and reference errors
	               
	               //show the command line
	            dlg.Show();
	            //run the current code on the IDE 
	             run(code.GetText());
	             
	             //now the terminal is shown 
	            isDebug = true ;
	          //print success
	           topScope.print("===== Execution success!! ======" , x ,y );
              
            	 return 
            	 
            	 }catch(e){ // we got an error
            	     //print it
            	   topScope.print(e);
            	   // print fail
            	   topScope.print("===== Execution aborted!! ======" , x ,y );
            	 } 
         }
            	 
  }
  
  // called when we exit out of the terminal
  function dlg_exit()
{
   // we exit the dialog
	 dlg.Dismiss();
	   //clear the terminal and reset the cursor y-coordinate
	    txt.Clear();
	     y = 0.02 ;
	     
	 /*
	  * I call OnBack because I want to clear the isDebug
	  * and I had a bug, when exiting the terminal
	  * the bug required me to double click the back key
	  * so I do it with code
	  * we exit the console using the back-key
	  * and we simulate the double click
	 */
	 OnBack();
}

// Console dialog
  function createDlg()
{
    dlg = app.CreateDialog( "running" );
    //set the exit function
    dlg.SetOnBack( dlg_exit );

    //the main console layout
    layDlg = app.CreateLayout( "linear", "VCenter,FillXY" );
    layDlg.SetSize( 1, 1 );
    //create the console and add it to the main layout
    CMD(layDlg);
    dlg.AddLayout( layDlg );


 //   dlg.Show();
}

app.LoadPlugin( "UIExtras" );

//create floating menu
function create_menu()
{ 
  //creates the plugin componet
 uix = app.CreateUIExtras();
 //the button layout,
 // its transparent and touchthrough
 layFam = app.CreateLayout( "Linear", "FillXY, Bottom, Right, TouchThrough" );
 
 //the menu button with the cogs icon
 fam = uix.CreateFAMenu( "[fa-cogs]", "Up,LabelsLeft" );
 fam.SetMargins( 0.02, 0.01, 0.02, 0.01 );
 fam.SetLabelBackColor( "#FFFFFF" );
 fam.SetLabelTextColor( "#646464" );
 fam.SetOnOpened( fam_OnOpened );
 fam.SetOnClosed( fam_OnClosed );
 
 //add the menu button to the menu layout
 layFam.AddChild( fam );
 
 // the run button
 fabReply = uix.CreateFAButton( "[fa-code]", "Mini" );
 fabReply.SetButtonColors( "#db4437", "#c33d32" );
 fabReply.SetOnTouch( cmpl );
 fabReply.SetLabel( "Run" );
 fam.AddFAButton( fabReply );
 
 // the github button
 fabReplyAll = uix.CreateFAButton( "[fa-github]", "Mini" );
 fabReplyAll.SetButtonColors( "#db4437", "#c33d32" );
// fabReplyAll.SetOnTouch( fab_OnMailReplyAll );
 fabReplyAll.SetLabel( "Pull request" );
 fam.AddFAButton( fabReplyAll );
 
 // UNASSIGNED!!!!!!!.
 /*
 * TO-DO: create more functionalith for the IDE
 */
 fabForward = uix.CreateFAButton( "[fa-share]", "Mini" );
 fabForward.SetButtonColors( "#fbbc05", "#efb306" );
// fabForward.SetOnTouch( fab_OnMailForward );
 fabForward.SetLabel( "pull request" );
 fam.AddFAButton( fabForward );
 
 app.AddLayout( layFam ); 
}

// these adjust the menu button color
// when pressed and released
function fam_OnOpened()
{
 layFam.SetBackColor( "#99FFFFFF" );
}

function fam_OnClosed()
{
 layFam.SetBackColor( "#00FFFFFF" );
}


  
  
  