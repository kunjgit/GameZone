import usePrivateTheme from '@mui/private-theming/useTheme';
export default function useTheme() {
  var _privateTheme$$$mater;
  var privateTheme = usePrivateTheme();
  return (_privateTheme$$$mater = privateTheme == null ? void 0 : privateTheme.$$material) != null ? _privateTheme$$$mater : privateTheme;
}