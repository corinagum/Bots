using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CSharpHello
{
    class Program
    {
        static void Main(string[] args)
        {
            bool repeat = false;

            Console.WriteLine("What is your name?");
            string name = Console.ReadLine();
            Console.WriteLine("Hello, " + name);
            Dictionary<Char, int> LetterCounter = new Dictionary<char, int>();

            for(int i = 0; i < name.Length; i++)
            {
                name = name.ToLower();
                Char Letter = name[i];
                if (LetterCounter.ContainsKey(Letter))
                {
                    repeat = true;
                    LetterCounter[Letter]++;
                } else
                {
                    LetterCounter[Letter] = 1;
                }
            }
            foreach (var character in LetterCounter)
            {
                if(character.Value > 1)
                {
                    Console.WriteLine("The letter {0} appears in your name {1} times", character.Key, character.Value);
                }
            }
            if(repeat == false)
            {
                Console.WriteLine("None of the letters in your name repeat!");
            }
            Console.ReadLine();
        }
    }
}
