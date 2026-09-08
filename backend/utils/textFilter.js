const germanStopwords = new Set([
  "aber","alle","allem","allen","aller","alles","als","also","am","an","ander","andere",
  "anderem","anderen","anderer","anderes","anderm","andern","anderr","anders","auch",
  "auf","aus","bei","bin","bis","bist","da","damit","dann","der","den","des","dem","die",
  "das","daß","derselbe","derselben","denselben","desselben","demselben","dieselbe",
  "dieselben","dasselbe","dazu","dein","deine","deinem","deinen","deiner","deines","denn",
  "derer","dessen","dich","dir","du","dies","diese","diesem","diesen","dieser","dieses",
  "doch","dort","durch","ein","eine","einem","einen","einer","eines","einig","einige",
  "einigem","einigen","einiger","einiges","einmal","er","ihn","ihm","es","etwas","euer",
  "eure","eurem","euren","eurer","eures","für","gegen","gewesen","hab","habe","haben",
  "hat","hatte","hatten","hier","hin","hinter","ich","mich","mir","ihr","ihre","ihrem",
  "ihren","ihrer","ihres","euch","im","in","indem","ins","ist","jede","jedem","jeden",
  "jeder","jedes","jene","jenem","jenen","jener","jenes","jetzt","kann","kein","keine",
  "keinem","keinen","keiner","keines","können","könnte","machen","man","manche","manchem",
  "manchen","mancher","manches","mein","meine","meinem","meinen","meiner","meines","mit",
  "muss","musste","nach","nicht","nichts","noch","nun","nur","ob","oder","ohne","sehr",
  "sein","seine","seinem","seinen","seiner","seines","selbst","sich","sie","ihnen","sind",
  "so","solche","solchem","solchen","solcher","solches","soll","sollte","sondern","sonst",
  "über","um","und","uns","unse","unsem","unsen","unser","unses","unter","viel","vom",
  "von","vor","während","war","waren","warst","was","weg","weil","weiter","welche",
  "welchem","welchen","welcher","welches","wenn","werde","werden","wie","wieder","will",
  "wir","wird","wirst","wo","wollen","wollte","würde","würden","zu","zum","zur","zwar",
  "zwischen",

  "mal","halt","eben","schon","wohl","vielleicht","ja","nein","immer","nie","oft","selten",
  "gern","leider","natürlich","übrigens","eigentlich","ziemlich","fast","bloß","etwa",
  "circa","ungefähr","bereits","erst","später","früher","heute","morgen","gestern","bald",
  "damals","gleich","sofort","überall","nirgendwo","wohin","woher","wann","warum","wieso",
  "weshalb","deshalb","darum","daher","dennoch","trotzdem","inzwischen","mittlerweile",
  "ansonsten","außerdem","ferner","beziehungsweise","nämlich","zumal","insbesondere",
  "beide","mehr","weniger","manchmal","keinesfalls","überhaupt","gar","völlig","total",
  "ebenfalls","bevor","nachdem","falls","obwohl","sobald","soweit","sowie","wobei",
  "weswegen","worauf","worüber","womit","woraus","worin","worunter","woraufhin"
]);

function filterText(text) {

  // Join words split across lines
  text = text.replace(/-\s*\n\s*/g, "");

  const words = text
  .split(/\s+/)
  .map(word => word.replace(/[.,!?;:"()[\]{}]/g, ""))
  .map(word => word.trim())
  .filter(Boolean)
  // Must contain letters only
  .filter(word => /^[a-zA-ZäöüÄÖÜß]+$/.test(word))
  // Ignore words with 2 or fewer characters
  .filter(word => word.length > 2);

  const filtered = words.filter(word => {
    return !germanStopwords.has((word.toLowerCase()));
  });

  return [...new Set(filtered)]; //Set only stores unique values so this'll remove duplicate words before translation ;)
}

module.exports = { filterText };