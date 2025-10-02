import ShadowCSS from "../../utils/shadowCSS.util.js";
import shadowCssText from "./assets/bin/shadow.min.css";

export const PLAYER_LOADING_CSS_CLASS = "loading";

const { style } = ShadowCSS.create(shadowCssText);

export default style;