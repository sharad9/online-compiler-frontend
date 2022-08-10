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
n = 10;  
m = (2 * n) - 2  
for i in range(0, n):  
    for j in range(0, m):  
        print(end=" ")  
    m = m - 1 
    for j in range(0, i + 1):  
        
        print("* ", end=' ')  
    print(" ") 

`;

stubs.java =
`import java.io.*;
public class GeeksForGeeks
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
