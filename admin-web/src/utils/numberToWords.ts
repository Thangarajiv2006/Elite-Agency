export function numberToWords(num: number): string {
  const a = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen ",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if ((num = num || 0) === 0) return "Zero";
  
  // ensure integer
  const n = Math.floor(Math.abs(num));
  const s = ("000000000" + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  
  if (!s) return "";

  let str = "";
  str += parseInt(s[1]) != 0 ? (a[Number(s[1])] || b[s[1][0] as any] + " " + a[s[1][1] as any]) + "Crore " : "";
  str += parseInt(s[2]) != 0 ? (a[Number(s[2])] || b[s[2][0] as any] + " " + a[s[2][1] as any]) + "Lakh " : "";
  str += parseInt(s[3]) != 0 ? (a[Number(s[3])] || b[s[3][0] as any] + " " + a[s[3][1] as any]) + "Thousand " : "";
  str += parseInt(s[4]) != 0 ? (a[Number(s[4])] || b[s[4][0] as any] + " " + a[s[4][1] as any]) + "Hundred " : "";
  str += parseInt(s[5]) != 0 ? (str != "" ? "and " : "") + (a[Number(s[5])] || b[s[5][0] as any] + " " + a[s[5][1] as any]) : "";
  
  return "Rupees " + str.trim() + " Only";
}
