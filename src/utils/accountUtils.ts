export const normalizeAccountNumber = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
};

export const accountNumbersMatch = (
  left: string | number | null | undefined,
  right: string | number | null | undefined
): boolean => {
  return normalizeAccountNumber(left) === normalizeAccountNumber(right);
};

export const replaceAccountNamePrefix = (details: string, oldName: string, newName: string): string => {
  if (!details || !oldName || oldName === newName || !details.startsWith(oldName)) {
    return details;
  }

  return `${newName}${details.slice(oldName.length)}`;
};

export const resolveCurrentAccountNumber = (
  storedAccountNumber: string | number | null | undefined,
  details: string,
  accounts: Record<string, string>
): string => {
  const normalizedStoredNumber = normalizeAccountNumber(storedAccountNumber);

  if (normalizedStoredNumber && accounts[normalizedStoredNumber]) {
    return normalizedStoredNumber;
  }

  const matchingEntry = Object.entries(accounts).find(([, accountName]) => {
    return details?.startsWith(accountName);
  });

  return matchingEntry ? matchingEntry[0] : normalizedStoredNumber;
};
