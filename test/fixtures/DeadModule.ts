// const oldTempA = 123;
// const oldTempB = 456;
// function deprecatedHelper() { return oldTempA; }
// if (true) { console.log(oldTempB); }

export const completelyDeadExport = () => {
  return 'nobody imports me anywhere';
};
