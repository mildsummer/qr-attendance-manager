export const CHANGE_DATE = "CHANGE_DATE";
export const NAVIGATE = "NAVIGATE";

export const navigate = routeName => ({
  type: NAVIGATE,
  navigate: routeName
});
