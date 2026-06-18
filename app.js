const previewCanvas = document.querySelector('#previewCanvas');
const pipVideo = document.querySelector('#pipVideo');
const controls = document.querySelector('#controls');
const launchButton = document.querySelector('#launchButton');
const launchLabel = document.querySelector('#launchLabel');
const status = document.querySelector('#status');
const ctx = previewCanvas.getContext('2d');

const inputs = {
  color: document.querySelector('#color'),
  size: document.querySelector('#size'),
  thickness: document.querySelector('#thickness'),
  gap: document.querySelector('#gap'),
};

const outputs = {
  color: document.querySelector('#colorValue'),
  size: document.querySelector('#sizeValue'),
  thickness: document.querySelector('#thicknessValue'),
  gap: document.querySelector('#gapValue'),
};

let animationFrame;
let stream;

function getSettings() {
  return {
    style: controls.elements.style.value,
    background: controls.elements.background.value,
    color: inputs.color.value,
    size: Number(inputs.size.value),
    thickness: Number(inputs.thickness.value),
    gap: Number(inputs.gap.value),
  };
}

function drawReticle() {
  const { style, background, color, size, thickness, gap } = getSettings();
  const { width, height } = previewCanvas;
  const x = width / 2;
  const y = height / 2;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = thickness;
  ctx.lineCap = 'square';

  if (style === 'cross' || style === 'cross-dot') {
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x - gap, y);
    ctx.moveTo(x + gap, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y - gap);
    ctx.moveTo(x, y + gap);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  if (style === 'dot' || style === 'cross-dot') {
    ctx.beginPath();
    ctx.arc(x, y, Math.max(thickness * 1.4, style === 'dot' ? size / 5 : 2), 0, Math.PI * 2);
    ctx.fill();
  }

  if (style === 'circle') {
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  animationFrame = requestAnimationFrame(drawReticle);
}

function updateOutputs() {
  outputs.color.value = inputs.color.value.toUpperCase();
  outputs.size.value = inputs.size.value;
  outputs.thickness.value = inputs.thickness.value;
  outputs.gap.value = inputs.gap.value;
  document.documentElement.style.setProperty('--accent', inputs.color.value);
}

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle('error', isError);
}

async function launchPip() {
  if (!document.pictureInPictureEnabled || !HTMLCanvasElement.prototype.captureStream) {
    setStatus('このブラウザはPicture-in-Pictureに対応していません。PC版ChromeまたはEdgeをお試しください。', true);
    return;
  }

  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      return;
    }

    if (!stream) {
      stream = previewCanvas.captureStream(30);
      pipVideo.srcObject = stream;
    }

    await pipVideo.play();
    await pipVideo.requestPictureInPicture();
  } catch (error) {
    console.error(error);
    setStatus('PiPを開始できませんでした。別のPiPを閉じてから、もう一度お試しください。', true);
  }
}

controls.addEventListener('input', () => {
  updateOutputs();
  setStatus(document.pictureInPictureElement ? '設定はPiPウィンドウにリアルタイムで反映されます。' : '');
});

launchButton.addEventListener('click', launchPip);
pipVideo.addEventListener('enterpictureinpicture', () => {
  launchLabel.textContent = 'PiPを閉じる';
  setStatus('PiPウィンドウを任意の位置とサイズに調整してください。');
});
pipVideo.addEventListener('leavepictureinpicture', () => {
  launchLabel.textContent = 'PiPで表示';
  setStatus('');
});

if (!document.pictureInPictureEnabled || !HTMLCanvasElement.prototype.captureStream) {
  launchButton.disabled = true;
  setStatus('非対応ブラウザです。PC版ChromeまたはEdgeをご利用ください。', true);
}

updateOutputs();
drawReticle();

window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(animationFrame);
  stream?.getTracks().forEach((track) => track.stop());
});
