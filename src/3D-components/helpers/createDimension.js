import * as THREE from "three";

export function createDimension(labelText) {
  const group = new THREE.Group();

  // Create text plate
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 128;

  // Style the text
  ctx.fillStyle = "#383737ff";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText(labelText, canvas.width / 2, canvas.height / 2);

  // Convert to three.js
  const texture = new THREE.CanvasTexture(canvas);

  // Sprite: Flat area, automatically facing the camera
  const textSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, transparent: true }),
  );
  textSprite.scale.set(0.25, 0.12, 1);

  group.add(textSprite);

  let target = null;
  let offset = null;

  // Connect sprite to line
  function attachTo(mesh, offsetVector) {
    target = mesh;
    offset = offsetVector;
  }

  // Updates sprite to always follow its target
  function update(camera) {
    if (!target) return;

    target.getWorldPosition(group.position);
    target.getWorldQuaternion(group.quaternion);

    // Makes the text stay horizontal even when user rotates over transverse axis
    const worldOffset = offset.clone().applyQuaternion(group.quaternion);
    group.position.add(worldOffset);
  }

  return { group, attachTo, update };
}
