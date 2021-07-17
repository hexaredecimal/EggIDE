

app.LoadScript( "lexer.js"  );
isDebug = false ;
//Called when application is started.
function OnStart()
{

 app.EnableBackKey( false );
	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "linear", "VCenter,FillXY" );	
  
      createDlg();
/*  var str = run(`
  do(define(x, 4),
   define(setx, fun(val, +(val,5))),
   setx(50),
   print(setx(50)),
` );*/
   
	//Create a text label and add it to layout.
   code = app.CreateTextEdit("", 1,0.9 ,  "Multiline" );
   lay.AddChild(code);
	
	 btn = app.CreateButton("compile" , 1,0.1 );
	 btn.SetOnTouch(cmpl);
	 
	 lay.AddChild(btn);
	   
	   
	//Add layout to app.	
	app.AddLayout( lay );
}

function OnBack()
{ 
//  app.ShowPopup( "Called"  );
	 if ( isDebug) {
	     isDebug = false ;
	     dlg.Dismiss();
	     txt.Clear();
	     y = 0.02 ;
	 }
	 
}


  function cmpl(){
        if( !isDebug )
        {
	            try{
	        
	            dlg.Show();
	            var res = run(code.GetText());
	             isDebug = true ;
	             
	             if ( BUFFER.length > 0 )
	            {
	                //alert(BUFFER);
	                
	                for ( var i = 0 ; i < BUFFER.length ; i++)
	                {
	                    //txt.Log(BUFFER[i]+"\n", "green" );
	                    txt.DrawText(BUFFER[i] ,  x, y );
	                    y+= 0.02 ;
	                    
	                }
	                
	                txt.DrawText("===== Execution success!! ======" , x ,y )
	                
	                BUFFER = [] ;
	                BUFFER_INDEX = BUFFER.length ;
	            }
            	 
            //	 app.Debug(">> "+res );
              
            	 return res ;
            	 
            	 }catch(e){ alert(e); } 
         }
            	 
  }
  
  
  
  function createDlg()
{
    dlg = app.CreateDialog( "running" );

    layDlg = app.CreateLayout( "linear", "VCenter,FillXY" );
    layDlg.SetSize( 1, 1 );
    CMD(layDlg);
    dlg.AddLayout( layDlg );


 //   dlg.Show();
}


  
  
  