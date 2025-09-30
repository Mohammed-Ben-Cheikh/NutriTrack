// function chaineTest(string = []) {
//   let obj = [
//     ["(", ")"],
//     ["[", "]"],
//     ["{", "}"],
//   ];
//   let a = 0;
//   let b = a + 1;
//   let c = string.length - 1;
//   let d = null;
//   let e = [];

//   while (a < c) {
//     obj.forEach((objElem) => {
//       console.log("1er", string[a], objElem[0]);
//       if (string[a] === objElem[0]) {
//         for (let i = b; i < c; i++) {
//           if (string){}
//         }
//       }
//     });
//     a++;
//   }
// }

// console.log(chaineTest("(()[]{})"));

function chaineTest(string = []) {
  const a = "({[";
  const b = ")}]";
  const stack = [];
  for (let i = 0; i < string.length; i++) {
    if (a.includes(string[i])) {
      stack.push(1);
    } else if (b.includes(string[i])) {
      stack.length === 0 ? stack.push(1) : stack.pop(1);
    }
  }
  return stack.length === 0 ? true : false;
}

console.log(chaineTest("(()[](){})()"));
