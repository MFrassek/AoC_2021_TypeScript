const main = (filePath: string) => {
  // Solve manually:
  // Treat the number as stack that needs to be emptied after all operations completed
  // push digit[0] + 1
  // push digit[1] + 7
  // push digit[2] + 13
  // pop digit[3] = digit[2] + 13 - 6 = digit[2] + 7
  // push digit[4] + 0
  // pop digit[5] = digit[4] + 0 - 4 = digit[4] - 4
  // push digit[6] + 11
  // push digit[7] + 6
  // push digit[8] + 1
  // pop digit[9] = digit[8] + 1 - 0 = digit[8] + 1
  // pop digit[10] = digit[7] + 6 - 0 = digit[7] + 6
  // pop digit[11] = digit[6] + 11 - 3 = digit[6] + 8
  // pop digit[12] = digit[1] + 7 - 9 = digit[1] - 2
  // pop digit[13] = digit[0] + 1 - 9 = digit[0] - 8

  // Therefore following conditions need to be fulfilled:
  // digit[3] = digit[2] + 7
  // digit[5] = digit[4] - 4
  // digit[9] = digit[8] + 1
  // digit[10] = digit[7] + 6
  // digit[11] = digit[6] + 8
  // digit[12] = digit[1] - 2
  // digit[13] = digit[0] - 8

  // Solving for the highest number gives: 99299513899971
  // Solving for the lowest number gives: 93185111127911
  console.log(99299513899971);
  console.log(93185111127911);
};

main("./day24_input.txt");
