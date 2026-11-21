import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

/**
 * Mathematical test suite for 3D Gyro-Parallax coordinates and rotation transformations.
 */
describe('3D Gyro-Parallax Physics & Transformation Math (Feature 4B)', () => {
  function computePointerTilt(clientX, clientY, rect, maxTilt = 15) {
    const px = Math.max(-0.5, Math.min(0.5, (clientX - rect.left) / rect.width - 0.5));
    const py = Math.max(-0.5, Math.min(0.5, (clientY - rect.top) / rect.height - 0.5));

    // Invert py for rotateX (tilting upwards when cursor is above center)
    const rotateX = (-py * 2 * maxTilt) || 0;
    const rotateY = (px * 2 * maxTilt) || 0;

    const glareX = 50 + px * 80;
    const glareY = 50 + py * 80;

    return { px, py, rotateX, rotateY, glareX, glareY };
  }

  function computeGyroTilt(gamma, beta, maxTilt = 15) {
    // gamma: left-to-right tilt clamped to ±25 deg
    // beta: front-to-back tilt clamped around 45 deg resting angle
    const rawX = Math.max(-25, Math.min(25, gamma || 0));
    const rawY = Math.max(-25, Math.min(25, (beta || 45) - 45));

    const px = rawX / 50;
    const py = rawY / 50;

    const rotateX = (-py * 2 * maxTilt) || 0;
    const rotateY = (px * 2 * maxTilt) || 0;

    return { px, py, rotateX, rotateY };
  }

  test('pointer at center produces 0 degree neutral rotation', () => {
    const rect = { left: 100, top: 100, width: 400, height: 500 };
    const result = computePointerTilt(300, 350, rect);

    assert.equal(result.px, 0);
    assert.equal(result.py, 0);
    assert.equal(result.rotateX, 0);
    assert.equal(result.rotateY, 0);
    assert.equal(result.glareX, 50);
    assert.equal(result.glareY, 50);
  });

  test('pointer at top-right corner produces correct positive Y tilt and positive X tilt', () => {
    const rect = { left: 0, top: 0, width: 400, height: 500 };
    const result = computePointerTilt(400, 0, rect, 15);

    assert.equal(result.px, 0.5);
    assert.equal(result.py, -0.5);
    assert.equal(result.rotateX, 15); // tilts backwards so top faces viewer
    assert.equal(result.rotateY, 15); // tilts rightwards
    assert.equal(result.glareX, 90);
    assert.equal(result.glareY, 10);
  });

  test('pointer outside card bounds is clamped smoothly to limits', () => {
    const rect = { left: 0, top: 0, width: 200, height: 200 };
    const result = computePointerTilt(9999, -9999, rect, 15);

    assert.equal(result.px, 0.5);
    assert.equal(result.py, -0.5);
    assert.equal(result.rotateX, 15);
    assert.equal(result.rotateY, 15);
  });

  test('device gyroscope orientation maps smoothly to 3D rotation angles', () => {
    // Phone held at neutral 45 degree viewing angle
    const neutral = computeGyroTilt(0, 45, 15);
    assert.equal(neutral.rotateX, 0);
    assert.equal(neutral.rotateY, 0);

    // Phone tilted 25 degrees to the right
    const rightTilt = computeGyroTilt(25, 45, 15);
    assert.equal(rightTilt.rotateY, 15);
    assert.equal(rightTilt.rotateX, 0);
  });
});
