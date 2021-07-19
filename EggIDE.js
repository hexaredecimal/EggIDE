

app.LoadScript( "lexer.js"  );
isDebug = false ;


//Called when application is started.
function OnStart()
{

 app.EnableBackKey( false );
	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "linear", "VCenter,FillXY" );	
  
      createDlg();
   
	//Create a text label and add it to layout.
   code = app.CreateCodeEdit(1,1);
   code.SetTextSize(10);
   code.SetNavigationMethod( "Yoyo" );
   code.SetLanguage(".js");
   lay.AddChild(code);
	   
	//Add layout to app.	
	app.AddLayout( lay );
	
		create_menu();
}

function OnBack()
{ 
//  app.ShowPopup( "Called"  );
	 if ( isDebug) {
	     isDebug = false ;
	     
	  
	 }
	 
}


  function cmpl(){
        if( !isDebug )
        {
	            try{
	        
	            dlg.Show();
	            var res = run(code.GetText());
	            isDebug = true ;
	          
	           topScope.print("===== Execution success!! ======" , x ,y );
              
            	 return res ;
            	 
            	 }catch(e){ 
            	  
            	   topScope.print(e);
            	   topScope.print("===== Execution aborted!! ======" , x ,y );
            	 } 
         }
            	 
  }
  
  
  function dlg_exit()
{
	 dlg.Dismiss();
	    txt.Clear();
	     y = 0.02 ;
	 OnBack();
}

  function createDlg()
{
    dlg = app.CreateDialog( "running" );
    dlg.SetOnBack( dlg_exit );

    layDlg = app.CreateLayout( "linear", "VCenter,FillXY" );
    layDlg.SetSize( 1, 1 );
    CMD(layDlg);
    dlg.AddLayout( layDlg );


 //   dlg.Show();
}

app.LoadPlugin( "UIExtras" );

function create_menu()
{ 
 uix = app.CreateUIExtras();
 
 layFam = app.CreateLayout( "Linear", "FillXY, Bottom, Right, TouchThrough" );
 fam = uix.CreateFAMenu( "[fa-cogs]", "Up,LabelsLeft" );
 fam.SetMargins( 0.02, 0.01, 0.02, 0.01 );
 fam.SetLabelBackColor( "#FFFFFF" );
 fam.SetLabelTextColor( "#646464" );
 fam.SetOnOpened( fam_OnOpened );
 fam.SetOnClosed( fam_OnClosed );
 layFam.AddChild( fam );
 
 fabReply = uix.CreateFAButton( "[fa-code]", "Mini" );
 fabReply.SetButtonColors( "#db4437", "#c33d32" );
 fabReply.SetOnTouch( cmpl );
 fabReply.SetLabel( "Run" );
 fam.AddFAButton( fabReply );
 
 fabReplyAll = uix.CreateFAButton( "[fa-github]", "Mini" );
 fabReplyAll.SetButtonColors( "#db4437", "#c33d32" );
 fabReplyAll.SetOnTouch( fab_OnMailReplyAll );
 fabReplyAll.SetLabel( "Pull request" );
 fam.AddFAButton( fabReplyAll );
 
 fabForward = uix.CreateFAButton( "[fa-share]", "Mini" );
 fabForward.SetButtonColors( "#fbbc05", "#efb306" );
 fabForward.SetOnTouch( fab_OnMailForward );
 fabForward.SetLabel( "pull request" );
 fam.AddFAButton( fabForward );
 
 app.AddLayout( layFam ); 
}
function fam_OnOpened()
{
 layFam.SetBackColor( "#99FFFFFF" );
}

function fam_OnClosed()
{
 layFam.SetBackColor( "#00FFFFFF" );
}

function fab_OnMailReply()
{
 app.ShowPopup( "Reply" );
}

function fab_OnMailReplyAll()
{
 app.ShowPopup( "Reply All" );
}

function fab_OnMailForward()
{
 app.ShowPopup( "Forward" );
}

  
  
  