export const getHexCode = index => {
  const hexCodeArr = [
    '#E04E2E', //- Muted Orange-Red
    '#D6AB00', //- Soft Yellow
    '#2EBF4D', //- Calmer Green
    '#2D4FCB', //- Mellow Blue
    '#E02C8E', //- Gentle Pink
    '#2EDBC8', //- Subtle Aqua
    '#E07A2E', //- Soft Warm Orange
    '#9E2CCE', //- Muted Purple
    '#E02C2C', //- Softer Red
    '#2ECC70', //- Subdued Mint Green
  ];

  return hexCodeArr[index % hexCodeArr.length];
};
