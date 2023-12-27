// https://github.com/Vanuan/gedcom-tree/blob/master/gedcom-tree.js
// gedcom file exported from gramps
// https://stackoverflow.com/questions/14541988/gedcom-parser-in-javascript
// also add up to date gedcom/gramps file to website 

const fs = require("fs");

const FILE = fs.readFileSync("dec252023.ged").toString();
const NAMES = index_names(FILE);

var ind = /0 (?:(@[_A-Z0-9]*@) )?INDI/;

function get_some_first_names(file) {
  var thing = file.split(/\n0.*\n/);
  var ching = [];
  thing.forEach((line) => {
    ching.push(line.split(" ")[2]);
  });
  return ching;
}

function split_by_indiviual(file) {
  var thing = file.split(/0 (?:(@[_A-Z0-9]*@) )INDI/);
  thing.shift();
  return thing;
}

function index_names(file) {
  return file.match(/0 (?:(@[_A-Z0-9]*@) )INDI\n1 NAME [a-zA-Z\u00C0-\u024F\u1E00-\u1EFF ,.'-/]+/g);
}

function getting_sub_of_exec_result(reg, str, sub = 0) {
  if (reg.exec(str) === null) {
    return null;
  } else {
    return (reg.exec(str)[0]).slice(sub);
  }
}

function getting_sub_of_match_result(reg, str, sub = 0) {
  if (str.match(reg) === null) {
    return null;
  } else {
    return (str.match(reg)).map(m => m.slice(sub));
  }
}

function index_given_id(id) {
  const no = indBlocks.length;
    
  for (var i = 0; i < no; ++i) {
    if (individuals[i].id === id) {
      return i;
    }
  } 

  return null;
}

function sort_by_dob(arr_of_inds) {
  return arr_of_inds;
}

// then think about making index_names a simple application of the global const gotten from this
// or just make this part of the program and not in a function so that these things are always accessible?
const findIndBlock = /(?:(@[_A-Z0-9]*@) )INDI((.|\n)*?)\n0/g; // no zero at the beginning to avoid overlap

const indBlocks = FILE.match(findIndBlock); 

// get second instance with foo.*?(foo)

const findId = /(@[_A-Z0-9]*?@)/;

const findNameBlock = /NAME((.|\n)*?)\n[0-1]/g;

const nameBlocks = indBlocks.map(i => getting_sub_of_match_result(findNameBlock, i));

const findGEDName = /1 NAME [a-zA-Z\u00C0-\u024F\u1E00-\u1EFF ,.'-/]+/; // useless?
const findGivenName = /2 GIVN [a-zA-Z\u00C0-\u024F\u1E00-\u1EFF ,.'-]+/;
const findSurname = /2 SURN [a-zA-Z\u00C0-\u024F\u1E00-\u1EFF ,.'-]+/;
const findNickname = /2 NICK [a-zA-Z\u00C0-\u024F\u1E00-\u1EFF ,.'-]+/;

const findSex = /1 SEX (M|F)/;

const ids = indBlocks.map(i => getting_sub_of_exec_result(findId, i));
const GEDNames = indBlocks.map(i => getting_sub_of_exec_result(findGEDName, i, 7).replace(/\//g,"")); // 7 is length of "1 NAME "
const givenNames = nameBlocks.map(nb => getting_sub_of_exec_result(findGivenName, nb[0], 7)); // 7 is length of "2 GIVN "
const notMarriedGivenNames = nameBlocks.map(nb => 
  ((nb.length === 2) ? getting_sub_of_exec_result(findGivenName, nb[1], 7) : null)); // 7 is length of "2 GIVN ";
const surnames = nameBlocks.map(nb => getting_sub_of_exec_result(findSurname, nb[0], 7)); // 7 is length of "2 SURN "
const notMarriedSurnames = nameBlocks.map(nb => 
  ((nb.length === 2) ? getting_sub_of_exec_result(findSurname, nb[1], 7) : null)); // 7 is length of "2 SURN "
const nicknames = indBlocks.map(i => getting_sub_of_exec_result(findNickname, i, 7));// 7 is length of "2 NICK "
const sexes = indBlocks.map(i => getting_sub_of_exec_result(findSex, i, 6)); // 6 is length of "1 SEX "

// FOR NOW DO THE ABOVE, but in harmony with what is to follow, do a NAME recurse for GEDName givenName and surname instead of looking for 2 GIVN and 2 SURN
// ASSUMPTION?: if there is birth information there will be date? or fix by looking for death/something starting with 1

const findDate = /[0-9] DATE [a-zA-Z0-9 ]+/; // maybe need to change [0-9] to 2?
const findPlace = /[0-9] PLAC [a-zA-Z\u00C0-\u024F\u1E00-\u1EFF ,.'-]+/; // ''

const findBirth = /1 BIRT\n((.|\n)*?)\n1/; // note that there is 2 TYPE that has notes on birth

const births = indBlocks.map(i => getting_sub_of_exec_result(findBirth, i, 7)); // 7 is length of "1 BIRT "

const birthDates = births.map(i => getting_sub_of_exec_result(findDate, i, 7)); // 7 is length of "2 DATE "
const birthPlaces = births.map(i => getting_sub_of_exec_result(findPlace, i, 7)); // 7 is length of "2 PLAC "

const findDeath = /1 DEAT\n((.|\n)*?)\n1/;

const deaths = indBlocks.map(i => getting_sub_of_exec_result(findDeath, i, 7)); // 7 is length of "1 DEAT "

const deathDates = deaths.map(i => getting_sub_of_exec_result(findDate, i, 7)); // 7 is length of "2 DATE "
const deathPlaces = deaths.map(i => getting_sub_of_exec_result(findPlace, i, 7)); // 7 is length of "2 PLAC "

var individuals = [];

const number_of_individuals = indBlocks.length;

for (var i = 0; i < number_of_individuals; ++i) {
  individuals[i] = {
    "id" : ids[i],
    "GEDName" : GEDNames[i],
    "givenName" : givenNames[i],
    "surname" : surnames[i],
    "nickname" : nicknames[i],
    "notMarriedGivenName" : notMarriedGivenNames[i],
    "notMarriedSurname" : notMarriedSurnames[i],
    "sex" : sexes[i],
    "birthDate" : birthDates[i],
    "birthPlace" : birthPlaces[i],
    "deathDate" : deathDates[i],
    "deathPlace" : deathPlaces[i],
  }
}


const findFamBlock = /(?:(@[_A-Z0-9]*@) )FAM\n((.|\n)*?)\n0/g; // no zero at the beginning to avoid overlap

const famBlocks = FILE.match(findFamBlock); 

const findHusband = /1 HUSB (@[_A-Z0-9]*?@)/;
const findWife = /1 WIFE (@[_A-Z0-9]*?@)/;
const findChild = /1 CHIL (@[_A-Z0-9]*?@)/g;

const husbands = famBlocks.map(f => getting_sub_of_exec_result(findHusband, f, 7)); // 7 is length of "1 HUSB "
const wives = famBlocks.map(f => getting_sub_of_exec_result(findWife, f, 7)); // 7 is length of "1 WIFE "
const children = famBlocks.map(f => getting_sub_of_match_result(findChild, f, 7)); // 7 is length of "1 CHIL "
// use keys for families instead of storing families twice
const number_of_families = famBlocks.length;
// add multiple families under same person functionality later
for  (var i = 0; i < number_of_families; ++i) { // add marriage date functionality
  var husband_of_family = husbands[i];
  var wife_of_family = wives[i];
  var children_of_family = children[i];

  let husband_index = index_given_id(husbands[i]);
  let wife_index = index_given_id(wives[i]);

  if (husband_of_family !== null && wife_of_family !== null) {

    if (individuals[husband_index].families == null) {
      individuals[husband_index].families = [[wives[i]]];
      individuals[husband_index].familiesNames = [[individuals[wife_index].GEDName]];
    } else {
      individuals[husband_index].families.push([wives[i]]);
      individuals[husband_index].familiesNames.push([individuals[wife_index].GEDName]);
    }

    var no_of_families_to_husband = individuals[husband_index].families.length;
    individuals[husband_index].families[no_of_families_to_husband - 1].push(children_of_family);

    if (individuals[wife_index].families == null) {
      individuals[wife_index].families = [[husbands[i]]];
      individuals[wife_index].familiesNames = [[individuals[husband_index].GEDName]];
    } else {
      individuals[wife_index].families.push([husbands[i]]);
      individuals[wife_index].familiesNames.push([individuals[husband_index].GEDName]);
    }

    var no_of_families_to_wife = individuals[wife_index].families.length;
    individuals[wife_index].families[no_of_families_to_wife - 1].push(children_of_family);

    if (children_of_family !== null) {
      var children_names_of_family = children_of_family.map(c => individuals[index_given_id(c)].GEDName)
      individuals[husband_index].familiesNames[no_of_families_to_husband - 1].push(children_names_of_family);
      individuals[wife_index].familiesNames[no_of_families_to_wife - 1].push(children_names_of_family);
    } else {
      individuals[husband_index].familiesNames[no_of_families_to_husband - 1].push(null);
      individuals[wife_index].familiesNames[no_of_families_to_wife - 1].push(null);
    }

  } else if (husbands[i] !== null) {

    // check if null or not (null or array)
    if (individuals[husband_index].families == null) {
      var no_of_families_to_husband = 1;
      individuals[husband_index].families = [[null]];
      individuals[husband_index].familiesNames = [[null]];
    } else {
      var no_of_families_to_husband = individuals[husband_index].families.push([[null]]);
      individuals[husband_index].familiesNames.push([[null]]);
    }

    try {
      individuals[husband_index].families[no_of_families_to_husband - 1].push(children_of_family);
    } catch {
      console.error(individuals[husband_index]);
    }

    if (children_of_family !== null) {
      var children_names_of_family = children_of_family.map(c => individuals[index_given_id(c)].GEDName)
      individuals[husband_index].familiesNames[no_of_families_to_husband - 1].push(children_names_of_family);
    } else {
      individuals[husband_index].familiesNames[no_of_families_to_husband - 1].push(null);
    }

  } else if (wives[i] !== null) {

    if (individuals[wife_index].families == null) {
      individuals[wife_index].families = [[null]];
      individuals[wife_index].familiesNames = [[null]]; //
    } else {
      individuals[wife_index].families.push([[null]]);
      individuals[wife_index].familiesNames.push([[null]]);
    }

    var no_of_families_to_wife = individuals[wife_index].families.length;
    individuals[wife_index].families[no_of_families_to_wife - 1].push(children_of_family);
    if (children_of_family !== null) {
      var children_names_of_family = children_of_family.map(c => individuals[index_given_id(c)].GEDName)
      individuals[wife_index].familiesNames[no_of_families_to_wife - 1].push(children_names_of_family);
    } else {
      individuals[wife_index].familiesNames[no_of_families_to_wife - 1].push(null);
    }

  } if (children_of_family !== null) {

    for (c of children_of_family) {
      individuals[index_given_id(c)].parents = [husbands[i], wives[i]].filter(x => x !== null);
      if (husbands[i] !== null) {
        var dad_name = individuals[husband_index].GEDName;
      } else {
        var dad_name = null;
      } if (wives[i] !== null) {
        var mom_name = individuals[wife_index].GEDName;
      } else {
        var mom_name = null;
      }
      
      individuals[index_given_id(c)].parentsNames = [dad_name, mom_name].filter(x => x !== null);
    }
  }
}

let individuals_dictionary = new Object();

for (var i = 0; i < number_of_individuals; ++i) {
  individuals_dictionary[ids[i]] = individuals[i];
}

var __new = individuals_dictionary;


















let photos_json = fs.readFileSync("photos.json");

let photos = JSON.parse(photos_json);

let to_osoby = 
`<html>

<head>
<meta charset="UTF-8">
<title>Sol&iacute;novi</title>
<base target = "hlavni">
<style>
a:link{text-decoration: none}
a:link{color:blue}
a:visited{color:blue;}
a:hover{color:#8866FF}
img{margin:4px;border:2px solid black;}
</style>
</head>

<body>

<p>
`;

let display_names = [];

function compareFn(a, b) {
  if (a[1] < b[1]) {
    return -1;
  } else if (a[1] > b[1]) {
    return 1;
  }
  return 0;
}

for (const person of individuals) {
  display_names.push([person["id"],person["GEDName"]]);
}

display_names = display_names.sort(compareFn);

for (const person of display_names) {
    to_osoby += '<a href="osoby/' + person[0] + '.htm">' + person[1] + '</a><br>\n';
}

to_osoby += "\n</p>\n\n</body>\n\n</html>\n";

fs.writeFile("osoby.htm", to_osoby, (err) => { if (err) console.log(err); });


















function generate_page_from_id(id) {
  let h = 
`<html>

<head>
<meta charset="UTF-8">
<title>Solínovi</title>
<base target="hlavni">
<style>
a:link{text-decoration: none}
a:link{color:blue}
a:visited{color:blue;}
a:hover{color:#8866FF}
</style>
</head>
  
<body>
<h2>${__new[id]["GEDName"]}</h2>

<p>
`;

  if (__new[id]["birthDate"] != null) {
    h += `Birth: ${__new[id]["birthDate"]}`;

    if (__new[id]["birthPlace"] != null) {
      h += `, ${__new[id]["birthPlace"]}`;
    }

    if (__new[id]["deathDate"] != null) {
        h += "\n<br>\n";
    }

  }

  if (__new[id]["deathDate"] != null) {
    h += `Death: ${__new[id]["deathDate"]}`;

    if (__new[id]["deathPlace"] != null) {
      h += `, ${__new[id]["deathPlace"]}`;
    }

  }

  h += "\n</p>\n\n<p>\n";

  if (__new[id]["parents"] != null && __new[id]["parents"][0] != null) {
    h += `Father: <a href="${__new[id]["parents"][0]}.htm">${__new[id]["parentsNames"][0]}</a>`;

    if (__new[id]["parents"][1] != null) {
      h += "\n<br>\n";
    }
  }

  if (__new[id]["parents"] != null && __new[id]["parents"][1] != null) {
    h += `Mother: <a href="${__new[id]["parents"][1]}.htm">${__new[id]["parentsNames"][1]}</a>`;
  }

  h += "\n</p>\n\n";

  if (__new[id]["families"] != null) {

    for (var i = 0; i < __new[id]["families"].length; ++i) {

      let spouse = __new[id]["families"][i][0];
      let spouse_name = __new[id]["familiesNames"][i][0];

      h += "<p>\n";

      if (spouse != null) {
        h += `Partner: <a href="${spouse}.htm">${spouse_name}</a>\n<br>\n`;
      }
      
      let children = __new[id]["families"][i][1];
      let children_names = __new[id]["familiesNames"][i][1];

      if (children != null && children.length !== 0) {
        h += "Children:<br>";
        for (var j = 0; j < children.length; ++j) {
          h += `<a href="${children[j]}.htm">${children_names[j]}</a>\n<br>\n`;
        }
      }

      h += "</p>\n\n"
    }
  }

  // maybe add siblings for the gizela matuščinová case

  // add description here

  for (photo of photos) {
    if (photo["links"].includes(id)) {
        h += `<a href="../photos/${photo["path"]}" target="_blank">\n<img src="../photos/${photo["path"]}" height="500">\n</a>\n\n`
    }
  }

  // maybe instead have one photo and then a view photos thing

  h += "</body>\n\n</html>\n";

  return h;

}

for (var i = 0; i < individuals.length; ++i) {
  fs.writeFile(`osoby/${individuals[i]["id"]}.htm`, generate_page_from_id(individuals[i]["id"]), (err) => { if (err) console.log(err); });
}
 
