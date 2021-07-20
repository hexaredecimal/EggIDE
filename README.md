!EGG PROGRAMMING LANGUAGE 

egg is a simple but elegant programing language. It is small but yet packs a lot power and capabilities. It follows the functional programming paradigm. 
Here is a list of features

   * function declaration and calls
   * function return (expr and func decl)
   * safe code execution

The language is massively small and some might find it slow, that is due to the implementation language and writing non-optimised code.
I'll try and optimise it some other time.

!tutorial

1. Greetings
```
    do(
       print("Hello, world!!")
    )
```
    -- Here we use do to involve the evaluator and create a new scope.
    -- do is a built-in function which takes an unlimited number of arguments
    -- in Egg all statements return a value
    -- The evaluator will start executing from this point
    -- print is a built-in function for writing to the console

2. Variables

```
    do(
       var(x,10),
       print(x)
    )

```
   -- var is a built-in function for creating variables
   -- it takes the first argument as a name and the other as value
   -- it then returns the name bind to the value 
   -- print also returns its argument 
 

```
   do(
      var(x print(5)),
      print(x)
   )
   
3. Functions
```
	-- we can also declare our own functions
	-- we use the function function...lol
	-- it takes a list of parameters 
	-- and the body as the last parameter


```
	do(
		var( max, function(n1,n2 ,
			 if(>(n1,n2), n1, n2)
		   )
		),
		print(max(20,50))
	)
```

4. If statememts
	-- as you can see abover, we can also use the if function
	-- it takes 3 parameters 
	-- the first is the condition
	-- the second is the value if true 
	-- or a list of statements inside a do function
	-- the third is the value if false 
	-- or also a list of statemts


```
	do(
		var(n,30),
		if(>(n,30), 
			print("True"), 
			print("False")
		 )
	)

5. Loops
```

	-- loops can be created only with the while function
	-- it takes 2 parameters
	-- the first one is the condition
	-- the second one is the body
	-- it can be a value or a list of statements inside a do function

```
	do(
		var(n,20),
		while (>(n,0),
			do(
				print(n),
				var(n,-(n,1))
			)
		)
	)

6. Try (Exception handling)
```

	-- we can catch and handle exceptions 
	-- we use the try function 
	-- it takes 2 parameters
	-- the first parameter is the unsafe block
	-- it can be list of statements 
	-- the second parameter is the catch block
	-- it can be a list of statements 
	-- notice the syntax error below handled at runtime
```
	do(
		try(
			do(
				print("Hello"),
				$
			),
			print("Syntax error $$$$")
		)
	)
	
8. Throw (Exception Handling)
```
	-- we can also throw our own exceptions 
	-- we use the throw function 
	-- it takes 1 parameter
	-- the first parameter is the message or the error value
	-- if not caught it prints the excpetion and exits the program unsuccessfully
	-- Here is an example
	
```
	do(
		print("Hello"),
		throw("Sudden death")
	)
```

	--- we can catch and bypass the exception 
	--- we must use a try function
	
```
	do(
		try(
			do(
				print("Hello"),
				throw("Sudden death")
			),
			print("Got revived")
		)

	)
```

9. Supported operators 

	-- Mathematical operations are also possible
	-- Here is a list of the supported mathematical operators:
		-- * + -> addition 
		-- * - -> subtraction 
		-- * / -> division 
		-- * * -> multiplication
		-- * % -> modulus
		
	-- Logical operators are also supported 
	-- Here is a list of supported logical operators:
		-- * && -> logical and 
		-- * || -> logical or 
		-- * == -> logical equals to 
		-- * != -> logical not equals to
		-- * >  -> logical greater than
		-- * <  -> logical less than
		-- * >= -> logical greater or equals to
		-- * <= -> logical less or equals to
		
	-- Bitwise operators are also possible
	-- Here is a list of supported bitwise operators:
		-- * &  -> bitwise and
		-- * |  -> bitwise or
		-- * ^  -> bitwise xor
		-- * ~  -> bitwise not (buggy, still in working on it)
	
	-- Since the nature of the Egg programming language is functional programming 
	-- all the operators are functuons
	-- most of them take two values, left and right
	-- most, except the bitwise not.
	-- it only operates with one parameter

