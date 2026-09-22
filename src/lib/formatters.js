export function formatFees(amount) {
  if (!amount) return "N/A";
  if (amount >= 100000) {
    return `${(amount / 100000).toFixed(1)} L`;
  }
  return `${(amount / 1000).toFixed(0)} K`;
}

export function formatPackage(lpa) {
  if (!lpa) return "N/A";
  return `${lpa.toFixed(1)} LPA`;
}
