// src/utils/animations.js
const animations = import.meta.glob(
  "/src/assets/files/animations/jsons/*.json",
  { eager: true, import: "default" }
);

const animationMap = {};
for (const path in animations) {
  const fileName = path.split("/").pop().replace(".json", "");
  animationMap[fileName] = animations[path];
}

export default animationMap;
