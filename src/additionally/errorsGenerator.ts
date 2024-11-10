export default function errorsGenerator() {
  const CodeTypeMask = 0xc000;
  const CodeTypeMaskRoll = 14;
  const CodeDomainMask = 0x3000;
  const CodeDomainMaskRoll = 12;
  const CodeSystemMask = 0x00f00;
  const CodeSystemMaskRoll = 4 * 2;
  const CodeSubSystem1Mask = 0x000f0;
  const CodeSubSystem1MaskRoll = 4 * 1;
  const CodeSubSystem2Mask = 0x000f;
  const CodeSubSystem2MaskRoll = 4 * 0;

  const CodeTypeDict = {
    0: "P",
    1: "C",
    2: "B",
    3: "U",
  };

  const pCodeList = [];

  for (let i = 1; i < 0xffff; i++) {
    const code = i;
    const CodeType = (code & CodeTypeMask) >> CodeTypeMaskRoll;
    const CodeDomain = (code & CodeDomainMask) >> CodeDomainMaskRoll;
    const CodeSystem = (code & CodeSystemMask) >> CodeSystemMaskRoll;
    const CodeSubSystem1 =
      (code & CodeSubSystem1Mask) >> CodeSubSystem1MaskRoll;
    const CodeSubSystem2 =
      (code & CodeSubSystem2Mask) >> CodeSubSystem2MaskRoll;
    const pCode = `${CodeTypeDict[CodeType]}${CodeDomain}${CodeSystem.toString(
      16
    ).toUpperCase()}${CodeSubSystem1.toString(
      16
    ).toUpperCase()}${CodeSubSystem2.toString(16).toUpperCase()}`;

    pCodeList.push({
      canSel: true,
      discountSum: 0,
      id: i,
      isSel: false,
      priceSum: 0,
      dtc: pCode,
    });
  }

  return pCodeList;
}
