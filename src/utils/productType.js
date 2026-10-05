export const isToyItem = (item) => {
  const product = item?.product && typeof item.product === "object"
    ? item.product
    : item;
  const subCategory = product?.subCategory || item?.subCategory;
  const subCategoryLabel = typeof subCategory === "object"
    ? `${subCategory.name || ""} ${subCategory.slug || ""}`
    : String(subCategory || "");

  return Boolean(item?.isToy || product?.isToy) || /jouet|toy/i.test(subCategoryLabel);
};