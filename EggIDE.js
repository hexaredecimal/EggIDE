
//load the backend 
app.LoadScript( "lexer.js"  );

//for switching states
//between IDE and console 
isDebug = false ;
var  settings  = JSON.parse(app.ReadFile("settings.js"));


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
   code.SetColorScheme( settings.ide_theme )
   code.SetTextSize(settings.ide_font_size);
   code.SetNavigationMethod( settings.ide_navigation );
   code.SetLanguage(settings.ide_syntax);
   code.SetOnChange( function(){
       settings.ide_is_modified = true;
   });
   lay.AddChild(code);
	   
	//Add layout to app.	
	app.AddLayout( lay );
	
	//create the floating menu button
	//create it above the IDE
		create_menu();
		
		//Create a drawer containing a menu list.
	CreateDrawer();
	
	//Add main layout and drawer to app.	
	app.AddDrawer( drawerScroll, "Left", drawerWidth );
}


// call when the back key is pressed
function OnBack()
{ 
//  app.ShowPopup( "Called"  );
	 if ( isDebug) {
	     isDebug = false ;
	 }
	 
}


function compile_invoke()
{
	 if( settings.file_select !=  "Unsaved" )
	 {
	    return cmpl();
	 
	 }
	  else
	 {
	     alert("File not saved");
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
	            
	            //clean seen comments 
	            var src = code.GetText();
	            
	            
	            let m = new RegExp( '#[a-zA-Z0-9_]*\.egg'  ,  'm' );
	           if( m = m.exec(src) )
	          {
	              m = m.toString();
	              var include = m.replace("#" , "");
	              for ( var i = 0; settings.ide_std_lib.length ; i++)
	              {
	                   if ( settings.ide_std_lib[i] == include ) {
	                       //alert("True"); 
	                        //put the contents of the file
	                       var txt = app.ReadFile(settings.ide_std_lib_path +include ) +" ," ;
	                      
	                       src =   src.replace(m,txt);
	                       //alert(src);
	                       break;
	                   }
	 
	               }
	              
	          }
	
	            
	           m = new RegExp( settings.ide_comment_literal , 'm' )
	            if ( m = m.exec( src ) )
	              src =  src.replace(m , "");
	           
	             
	            //run the current code on the IDE 
	              
	             run(src);
	             
	             //now the terminal is shown 
	            isDebug = true ;
	          //print success
	           topScope.print(settings.compiler_success, x ,y );
              
            	 return 
            	 
            	 }catch(e){ // we got an error
            	     //print it
            	   topScope.print(e);
            	   // print fail
            	   topScope.print(settings.compiler_fail , x ,y );
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
 fam.SetLabelBackColor( settings.float_menu_back_color );
 fam.SetLabelTextColor( settings.float_menu_text_color );
 fam.SetOnOpened( fam_OnOpened );
 fam.SetOnClosed( fam_OnClosed );
 
 //add the menu button to the menu layout
 layFam.AddChild( fam );
 
 // the run button
 fabRun = uix.CreateFAButton( "[fa-code]", "Mini" );
 fabRun.SetButtonColors(settings.float_menu_item_back_color
 , settings.float_menu_item_text_color );
 fabRun.SetOnTouch( compile_invoke );
 fabRun.SetLabel( "Run" );
 fam.AddFAButton( fabRun );
 
  
  // the new file button
 fabFile = uix.CreateFAButton( "[fa-plus-circle]", "Mini" );
 fabFile.SetButtonColors( settings.float_menu_item_back_color
 , settings.float_menu_item_text_color );
// fabReplyAll.SetOnTouch( fab_OnMailReplyAll );
 fabFile.SetLabel( "New" );
 fam.AddFAButton( fabFile );
 
  // the save button
 fabSave= uix.CreateFAButton( "[fa-save]", "Mini" );
 fabSave.SetButtonColors( settings.float_menu_item_back_color
 , settings.float_menu_item_text_color );
 fabSave.SetOnTouch( SaveFile );
 fabSave.SetLabel( "Save");
 fam.AddFAButton( fabSave );
 
  // the Open button
 fabOpen = uix.CreateFAButton( "[fa-folder-open]", "Mini" );
 fabOpen.SetButtonColors( settings.float_menu_item_back_color
 , settings.float_menu_item_text_color );
fabOpen.SetOnTouch( OpenFile );
 fabOpen.SetLabel( "Open" );
 fam.AddFAButton( fabOpen);
 

 
 // the github button
 fabGithub = uix.CreateFAButton( "[fa-github]", "Mini" );
 fabGithub.SetButtonColors( settings.float_menu_item_altenate_back_color, 
 settings.float_menu_item_alternate_back_color );
// fabReplyAll.SetOnTouch( fab_OnMailReplyAll );
 fabGithub.SetLabel( "Pull request" );
 fam.AddFAButton( fabGithub );
 

 
 app.AddLayout( layFam ); 
}

// these adjust the menu button color
// when pressed and released
function fam_OnOpened()
{
 layFam.SetBackColor( settings.float_menu_down_color );
}

function fam_OnClosed()
{
 layFam.SetBackColor( settings.float_menu_up_color );
}



function CMD(layq)
{
		
	//Create a scroller for log window.
    scroll = app.CreateScroller( 1,1 )
    scroll.SetBackColor( settings.terminal_back_color );
    layq.AddChild( scroll );
      
	//Create text control for logging (max 500 lines).
	txt = app.CreateImage( null, 1,1);
	txt.SetBackColor( settings.terminal_back_color );
	scroll.AddChild( txt );
	 
	 return ;
}

//Create the drawer contents.
function CreateDrawer()
{
    //Create a layout for the drawer.
	//(Here we also put it inside a scroller to allow for long menus)
	drawerWidth = 0.75;
    drawerScroll = app.CreateScroller( drawerWidth, -1, "FillY" );
    drawerScroll.SetBackColor(settings.drawer_scroll_back_color);
	layDrawer = app.CreateLayout( "Linear", "Left" );
	drawerScroll.AddChild( layDrawer );
	
	//Create layout for top of drawer.
	layDrawerTop = app.CreateLayout( "Absolute" );
	layDrawerTop.SetBackground(settings.drawer_back_image);
	layDrawerTop.SetSize( drawerWidth, 0.23 );
	layDrawer.AddChild( layDrawerTop );
	
	//Add an icon to top layout.
	var img = app.CreateImage( settings.drawer_icon , 0.30);
	img.SetPosition( drawerWidth*0.06, 0.06 );
	layDrawerTop.AddChild( img );
	
	//app title
	var title = app.CreateText(settings.drawer_app_title_text ,  0.4, 0.1);
	title.SetTextSize( 30);
	title.SetTextColor(settings.drawer_app_title_text_color);
	title.SetPosition( drawerWidth*0.4 , 0.075 );

	layDrawerTop.AddChild( title);
	
	
	
	//Add user name to top layout.
	var txtUser = app.CreateText(settings.drawer_user_text ,-1,-1,"Bold");
	txtUser.SetPosition( drawerWidth*0.07, 0.155 );
	txtUser.SetTextColor(settings.drawer_user_text_color);
	txtUser.SetTextSize( 13.7, "dip" );
	layDrawerTop.AddChild( txtUser );
	
	//Add user email to top layout.
	txtGitHubRepo =  app.CreateText(settings.drawer_github_repo_text);
	txtGitHubRepo.SetPosition( drawerWidth*0.07, 0.185 );
	txtGitHubRepo.SetTextColor(settings.drawer_github_repo_text_color);
	txtGitHubRepo.SetTextSize( 14, "dip" );
	layDrawerTop.AddChild( txtGitHubRepo );
	
	//Create menu layout.
	var layMenu = app.CreateLayout( "Linear", "Left" );
	layDrawer.AddChild( layMenu );
	
	   
    //Add title between menus.
	txtTitle = app.CreateText( "Recent files",-1,-1,"Left");
	txtTitle.SetTextColor( "#666666" );
	txtTitle.SetMargins( 16,12,0,0, "dip" );
	txtTitle.SetTextSize( 14, "dip" );
	layMenu.AddChild( txtTitle );
	
    //Add a list to menu layout (with the menu style option).
    lstMenu1 = app.CreateList( ""  , drawerWidth, -1, "Menu,Expand" );
    lstMenu1.SetColumnWidths( -1, 0.35, 0.18 );
    
    for ( var i = 0; i<settings.file_list.length; i++)
    {
            lstMenu1.AddItem( settings.file_list[i] ,  "", "[fa-file]" );
    }
    
  //  lstMenu1.SetItemByIndex( 0, "Primary", 21 );
   lstMenu1.SetOnTouch( FileListClick );
    layMenu.AddChild( lstMenu1 );
    
    //Add seperator to menu layout.
    var sep = app.CreateImage( null, drawerWidth,0.001,"fix", 2,2 );
    sep.SetSize( -1, 1, "px" );
    sep.SetColor(settings.drawer_separator_color );
    layMenu.AddChild( sep );
 
	
    //Add a second list to menu layout.
    var listItems = "Starred::[fa-star],Important::[fa-flag],Settings::[fa-cog]";
    lstMenu2 = app.CreateList( listItems, drawerWidth, -1, "Menu,Expand" );
    lstMenu2.SetColumnWidths( -1, 0.35, 0.18 );
   // lstMenu2.SetOnTouch( lstMenu_OnTouch );
    layMenu.AddChild( lstMenu2 );
}

function SaveFile(){
  if( settings.ide_is_modified )
  {
   
      if ( settings.file_select ==  "Unsaved" )
       {
      		   
      		   	  /*
	    function OnStart()
{
ynd = app.CreateYesNoDialog( "Choose an answer" );
ynd.SetOnTouch( Ynd_OnTouch );
ynd.Show();
}

function Ynd_OnTouch( result )
{
    app.Alert( result, "Result" );
}
	  
	  */
	    
/*	    var ynd = app.CreateYesNoDialog( "So you wanna save?");
	    ynd.SetOnTouch( ynd_OnTouch );
	    ynd.SetBackColor(settings.drawer_scroll_back_color);
	    ynd.Show(); */
	    
	    var dlg = app.CreateDialog("Save file");
	    dlg.SetBackColor(settings.drawer_scroll_back_color);
	    dlg.SetOnBack(
	         function ()
           {
                	 path = settings.save_file_default_path ;
                  deep["c_home"] = 0;
                 deep["deep"] = 0;
                 dlg.Dismiss();
           }
	    );
	    
	    var layDlg = app.CreateLayout( "Linear", "VCenter,FillXY" );
	    layDlg.SetSize(0.8 , 0.8);
	    dlg.AddLayout( layDlg );
	    
	     var lst = app.ListFolder(settings.save_file_default_path);
	     app.Debug( lst );
	     app.Debug( "to string:\n"+lst.toString()  +"\n" );
	     picker = uix.CreatePicker( lst.toString() , 0.8, 0.4 );
	     picker.SetMargins(0.01, 0.01,0.01,0.01);
	     picker.SetTextColor("#ff00a1d9" );
       picker.SetOnChange( PickerOnChange );
       layDlg.AddChild( picker );
       
       var ed = app.CreateTextEdit( "" , 0.8 , 0.1 );
       ed.SetHint( "File name"  );
       ed.SetTextColor( "#ff00a1d9" );
       layDlg.AddChild( ed  );

	    var btn = [ "[fa-home]", "[fa-repeat]", "[fa-save]" ];
	    var lb = app.CreateLayout( "Linear", "Horizontal" );
	    for ( var i = 0; i < btn.length ; i++ )
	    {
	          var btns = app.CreateButton(btn[i], 0.2, 0.1 , "Custom,FontAwesome" );
	          btns.SetBackColor( "#ff00a1d9" );
	          
	          //for assigning button actions
	          switch (i)
	          {
	          
	          }
	          
	          lb.AddChild( btns );
	    }
	    
	    layDlg.AddChild( lb );
	    
	    dlg.Show();
	    
      }
    	else
    	{
      //  app.WriteFile(settings.file_select, code.GetText() );
      }
  }
}




function removeLast(f)
{
     var i = 0;
	   for ( i = f.length ; i > 0 ; i--)
	   {
	          if( f[i] == "/" )  break ;
	   }
	   
	   return f.slice(0, i );
}

var path = settings.save_file_default_path ;
var deep = {};
deep["c_home"] = 0;
deep["deep"] = 0;
function PickerOnChange(item)
{
     
    
   
  if ( item == "..." )
  {
        
      if ( (path +"/") !=  settings.save_file_default_path )
      {
        
        path = removeLast(path);
        
       if ( deep["deep"]  != 0) deep["deep"]-- ;
     }else{
        deep["c_home"] = 1 ;
     }
      
  }else if ( deep["deep"] == 0 )
  {   
            if ( deep["c_home"] == 1 ) 
            path += "/" + item ;
            else path += item ;
            deep["deep"]++;
 }
  else 
  {
      path += "/"+item ;
      deep["deep"]++ ;
  }
   
    
 
	  if ( app.IsFolder(path) )
	  {
      if (  (path +"/") !=  settings.save_file_default_path )
            deep["c_home"] = 1 ;
            
	   picker.SetList("...,"+app.ListFolder( path ).toString());
         
	   }
	   
	
}

function  ynd_OnTouch(result)
{
	 alert(result);
}



function FileListClick(title)
{
   if ( title != "Unsaved"  )
   {
       if ( title != settings.file_select )
       {
	      	settings.file_select = title ;
    		  code.SetText(app.ReadFile(settings.file_select, "UTF-8" ));
    	  	app.CloseDrawer( "left"  );
    	 }
    	 else{
    	    app.CloseDrawer( "left"  );
    	 }
	}
	else{
	
	    app.CloseDrawer( "left"  );
	}
}


function OpenFile()
{
	 app.ChooseFile( "Open file" , "text/plain"  , Choose );
}

function Choose(file)
{
    var file_name = file.split("/");
    file_name = file_name[file_name.length-1] ;
    
    if (  file_name.substring(file_name.length-4,file_name.length) == ".egg" )
       {
	 settings.file_list[settings.file_index] = file;
	 settings.file_select = file ;
	 settings.file_index++;
	 code.SetText(app.ReadFile(file, "UTF-8" ));
	 lstMenu1.RemoveAll();
	 
for ( var i = 0; i<settings.file_list.length; i++)
    {
            lstMenu1.AddItem( settings.file_list[i] ,  "", "[fa-file]" );
    }
    
    }else{
        alert("Not an egg source file:["+file+"]");
    }
}






  
  