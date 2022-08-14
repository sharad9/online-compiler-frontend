const stubs = {};

stubs.cpp = `#include <iostream>
#include <stdio.h>

using namespace std;

int main() {
  cout<<"Hello world!\\n";
  return 0;
}
`;

stubs.py =
`
# A Sample class with init method
class Person:

	# init method or constructor
	def __init__(self, name):
		self.name = name

	# Sample Method
	def say_hi(self):
		print('Hello, my name is', self.name);
		
	def pattern(self):
	    n = 10;
	    m = (2 * n) - 2;
	    for i in range(0, n):
	        for j in range(0, m):
	            print(end=" ")
	        m = m - 1;
	        for j in range(0, i + 1):
	            print("*", end=' ');
	        print(" ");
	    


p = Person('Sasa Online Compiler')
p.say_hi();
p.pattern();



`;

stubs.java =
`import java.io.*;
class ClassName1
{
	public static void printStars(int n)
	{
		int i, j;
		for(i=0; i<n; i++)
		{
			for(j=0; j<=i; j++)
			{
				System.out.print("* ");
			}
			System.out.println();
		}
}


	public static void main(String args[])
	{
		int n = 5;
		printStars(n);
	}
}


`;

export default stubs;
