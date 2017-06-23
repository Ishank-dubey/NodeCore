/**
 * http://usejsdoc.org/
 */
var s =require('./expModule');

console.log(s().a);//output's 1

s().a++;

var s1 =require('./expModule');

console.log(s1().a);//output's 2 i.e. becomes like a global var