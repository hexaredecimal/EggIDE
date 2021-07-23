  
  /*
    egglang.js
    
    *Author: Gama Sibusiso Vincent
    * The official backend for egglang
  */

//coordinates for the printing cursor 
  x = 0.02 ;
  y = 0.02;
  
 
   
function parseExpression(program) {
  
  //remove any spaces
  program = skipSpace(program);
  let match = "" , expr, cmnt ;
 
  
  if (match = /^"([^"]*)"/.exec(program))
   { // checks for strings values
    expr = {type: "value", value: match[1]};
  } 
  else if (
   (match = /^\d+\b/.exec(program)) || (match = /-([0-9]*)/.exec(program))
   )
  { // checks for numbers
    expr = {type: "value", value: Number(match[0])};
  } 
  else if (match = /([a-zA-Z0-9_]+\::[a-zA-Z0-9_]*)/.exec(program))
  {
      expr = {type: "word", name: match[0]};
    
  }
  else if (match = /^[^\s(),#"]+/.exec(program))
   { //checks for ids
    expr = {type: "word", name: match[0]};
  }
  else {
  // error on unexpected match
    
        throw new SyntaxError("Unexpected syntax: " + program);
    
        
  }
  
 
   //parse the match and return it
  return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {

if ( string != null )
{
        let m = new RegExp( '#[a-zA-Z0-9_]*\.egg'  ,  'm' );
	           if( m = m.exec(string) )
	          {
	              m = m.toString();
	              var include = m.replace("#" , "");
	              for ( var i = 0; settings.ide_std_lib.length ; i++)
	              {
	                   if ( settings.ide_std_lib[i] == include ) {
	                    //   alert("True"); 
	                        //put the contents of the file
	                       var txt = app.ReadFile(settings.ide_std_lib_path +include ) +" ," ;
	                       
	                       string =   string.replace(m,txt);
	                       //alert(string);
	                       break;
	                   }
	 
	               }
	              
	          }
	
 
   m = new RegExp( settings.ide_comment_literal , 'm' )
	if ( m = m.exec( string ) )
	string =  string.replace(m , "" );
	
  let first = string.search(/\S/);
  
  //skip all spaces and newline
  //this is an overkill
  // we lose control of line counting
  // TO-DO: fix line counting 
  
  if (first == -1) return ""; //return an empty string if the input has no spaces
   
  return string.slice(first);
 }
 
 return string ;
}

function parseApply(expr, program) { 
       //alert(expr.type + ":" + expr.name );
       //skip spaces
       program = skipSpace(program); 
       
       //if the fist token is not a scope, return it
       //alert(program[0] );
       if (program[0] != "(") {
           
             return {expr: expr, rest: program}; 
       }
       
       //else clean the scope
     program = skipSpace(program.slice(1));
     
     expr = {type: "apply", operator: expr, args: []}; 
    while (program[0] != ")") {
             //loop until we get the closing paranteses
             //we parse expression, since everything is one
             let arg = parseExpression(program); 
           
            expr.args.push(arg.expr);
            
            //clean the rest of the input
             program = skipSpace(arg.rest); 
             
             if (program[0] == ",") { 
                   //we still have more, clean it 
                   program = skipSpace(program.slice(1)); 
              } else if (program[0] != ")") { 
              // if we have no more and missing a closing paran
              // we report
                   throw new SyntaxError("Expected ',' or ')'"); 
                           
                   
              }
      } 
      //return a recursive call passing the last cleaned input
      return parseApply(expr, program.slice(1));
 
 }


function parse(program) { 
    // a program is also an expression
     let {expr, rest} = parseExpression(program);
      if ( rest != null )
      {
       
          if ( fnd = skipSpace(rest).length > 0) { 
            
           throw new SyntaxError("Unexpected text after program: "+fnd); 
      }
      return expr;
      }
      
      return "" ;
  }

//This object will help us implement 
// language grammar parts or syntax 
//e.g if statememts and loopz
const specialForms = Object.create(null);


//called by the run function
function evaluate(expr, scope) {
  if (expr.type == "value") {  //check if the expr is a value
    
    return expr.value;  //if true, return it
    
  } else if (expr.type == "word") {
      //if its an ID , check if it declared
      
    if (expr.name in scope) {
      return scope[expr.name]; 
    } else { 
    //error: undeclared variable
      throw new ReferenceError(
        `Undefined binding: ${expr.name}`);
    }
  } else if (expr.type == "apply") { //check if it a built-in function
  
    let {operator, args} = expr;
   
        
    if (operator.type == "word" &&
        operator.name in specialForms) {
        //if it is, return the function, with result
      return specialForms[operator.name](expr.args, scope);
    } else {
      //user defined funcrions
      let op = evaluate(operator, scope);
      if (typeof op == "function") {
        return op(...args.map(arg => evaluate(arg, scope)));
      } else {
        throw new TypeError("Applying a non-function.");
      }
    }
  }
}


/*
                          
     if ( 
         [condition],
         [stmt-if-true] , [stmt-if-false]
     )
*/
specialForms.if = (args, scope) => {
  if (args.length != 3) {
    throw new SyntaxError("Wrong number of args passed to if");
  } else if (evaluate(args[0], scope) !== false) { // condition
    return evaluate(args[1], scope); // expr true
  } else {
    return evaluate(args[2], scope); // expr false
  }
};


/*
   * while is a built-in function
   *
   * while (
       [condition], [body] 
   )
   
   
*/
specialForms.while = (args, scope) => {
  if (args.length != 2) {
    throw new SyntaxError("Wrong number of args passed to while");
  }
  while (evaluate(args[0], scope) !== false) {
    evaluate(args[1], scope);
  }

  // Since undefined does not exist in Egg, we return false,
  // for lack of a meaningful result.
  return false;
};

/*
    do(
         [stmt],
         [stmt],
         ......
    )
    
*/

specialForms.do = (args, scope) => {
  let value = false;
  for (let arg of args) {
    value = evaluate(arg, scope);
  }
  return value;
};


/*
    read(
    
    )
    
       *read takes no args and returns a result
*/

specialForms.read = (args, scope) => {
   
      if ( args.length >0 )
        /*  topScope.print("Type error:"+
         "wrong number of args passed to read" ); */
        throw new TypeError("Wrong number of arguments passed to read" );;
        
      return prompt("stdin:");

}


/*
     var( [ID] , [value] )
*/

specialForms.var = (args, scope) => {
  if (args.length != 2 || args[0].type != "word") {
        throw new SyntaxError("Incorrect use of define");
       /*  topScope.print("Type error:"+
         "wrong number of args passed to read" );*/
       
  }
  let value = evaluate(args[1], scope);
  scope[args[0].name] = value;
  return value;
};

// for maths operations
const topScope = Object.create(null);

topScope.true = true;
topScope.false = false;
topScope.null = null ;


 //define supported operators
for (let op of ["+", "-", "*", ">>" , "<<" , "%" , "&", "|" ,"&&","||" , "!=" , "/", "==", "<", ">"]) {
  topScope[op] = Function("a, b", `return a ${op} b;`);
}


specialForms.len = (args, scope) =>
{
     if (args.length < 1) 
      throw new TypeError("Wrong number of arguments passed to len");
      
      var res = evaluate(args[0]  , scope);
     
     return res.length  ;
}


/*
   arr(
    [value],
   [value],
      ...
   )

*/
specialForms.arr = (args, scope )=>
{
    var res = [];
    var i = 0;
     for (let arg of args) {
        res[i++] = evaluate(arg, scope);
     }
     
     return res ;
}

/*
   index( 
      [variable],
      [index]
   )
*/
specialForms.index = (args, scope) =>
{
     if (args.length < 2 /*|| args[0].type != "word" */ ) 
      throw new TypeError("Wrong number of arguments passed to index");
      
     var value =  evaluate(args[0],  scope);
     var index = evaluate(args[1], scope);
     // alert(value +" @ "+index +" = "+value[index] );
    return value[index] ;
}


/*
    print(
         [value] -> (optional)
    )
    
*/
topScope.print = value => {
   
   if ( value != null ){
  //update the y-value
   txt.DrawText(value ,  x, y );
	  y+= 0.02 ;
 }  
  else{
    value = "";
  }
  return value;
};


//called by cmpl function
function run(program) {
  if( program.length > 0 )
  {
   var scope = Object.create(topScope) ;
   
  return evaluate(parse(program), scope );
  } 
}




/*
      throw(
        [Error-message]
      )
*/
specialForms.throw = (args, scope) => {
    if ( args.length < 1 || args.length > 1)
        throw new TypeError("Wrong number of arguments passed to throw" );
        
    var val = evaluate( args[0] , scope);
    /*
    * throw exception to the console
    * instead of alerts
    */
  //  topScope.print(val);
     throw val ;
    return val;
}


/*
     try(
         [unsafe-block],
         [handle-exception] 
     )
*/
specialForms.try = (args, scope) => {
      if ( args.length < 2 )
      {
         throw new TypeError("Wrong number of arguments passed to try" );
      }
     
     try
     {
              // test the first argument
              var value = evaluate(args[0], scope);
               return value;
     }catch(e)
     {
         // test the error handling code
          var value = evaluate(args[1], scope);
  
          // throw a custom message 
          //if the value is initialised
          
          if ( value != null){
                // topScope.print(value);
           //throw default message
          }else topScope.print (e);
         return  value ;
     }
}


/*
    function(
        [arg],
        [arg],
        ......,
        
        [Body]
    )
*/
specialForms.function = (args, scope) => {
  if (!args.length) {
    throw new SyntaxError("Functions need a body");
  }
  let body = args[args.length - 1];
  let params = args.slice(0, args.length - 1).map(expr => {
     //check for expr params
    if (expr.type != "word") {
      throw new SyntaxError("Parameter names must be words");
    }
    return expr.name;
  });

  return function() {
    if (arguments.length != params.length) {
      throw new TypeError("Wrong number of arguments passed to function declaration");
    }
    
   
    let localScope = Object.create(scope);
    for (let i = 0; i < arguments.length; i++) {
      localScope[params[i]] = arguments[i];
    }
    return evaluate(body, localScope);
  };
};