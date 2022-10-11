import {Ref} from 'vue'

export interface WaterMarkInter {
    elRef: Ref<HTMLDivElement>;
    waterMark: string; 
    color?:string; 
    angle?: number; 
    width?: number; 
    height?: number; 
    alpha?: number;
    size?: string
}

export function waterMarker({elRef, waterMark="水印", color = "#e9e9e9", angle=-15, size="24",alpha=0.5, width=600, height=300}: WaterMarkInter) {
    if (!elRef) {
        return
    }
    
    const element = unref(elRef) as HTMLDivElement
    let canvasEle = document.createElement('canvas');
    element.appendChild(canvasEle);
    canvasEle.width = width;
    canvasEle.height = height;
    canvasEle.style.display = 'none';
    canvasEle.style.zIndex = '9'
    let cans = canvasEle.getContext('2d') as CanvasRenderingContext2D;
    cans.rotate(angle * Math.PI / 180);
    cans.font = "500 30px Microsoft JhengHei";
    cans.fillStyle = color;
    cans.textAlign = 'center';
    cans.textBaseline = 'middle';
    cans.globalAlpha = alpha
    cans.font = '1000 ' + size + 'px ' + ' Microsoft JhengHei'
    for (let i = (document.body.offsetHeight * 0.5) * -1; i < 800; i += 160) {
        for (let j = 0; j < document.body.offsetHeight * 1.5; j += 60) {
            cans.fillText(waterMark, i, j)
        }
    }
    element.style.backgroundImage = "url(" + canvasEle.toDataURL("image/png") + ")";
}

