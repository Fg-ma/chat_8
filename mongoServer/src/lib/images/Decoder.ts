import {
  beardsEffectDecodingMap,
  glassesEffectDecodingMap,
  hatsEffectDecodingMap,
  hideBackgroundEffectDecodingMap,
  masksEffectDecodingMap,
  mustachesEffectDecodingMap,
  petsEffectDecodingMap,
  postProcessEffectDecodingMap,
} from "../typeConstant";
import {
  imageEffectEncodingMap,
  ImageEffectStylesType,
  ImageEffectTypes,
} from "./typeConstant";

class Decoder {
  constructor() {}

  decodeMetaData = (data: {
    tid: string;
    iid: string;
    n: string;
    m: string;
    p: {
      p: {
        l: number;
        t: number;
      };
      s: {
        x: number;
        y: number;
      };
      r: number;
    };
    e: number[];
    es: {
      "0": {
        s: number;
      };
      "1": {
        s: number;
        c: string;
      };
      "2": {
        c: string;
      };
      "3": {
        s: number;
      };
      "4": {
        s: number;
      };
      "5": {
        s: number;
      };
      "6": {
        s: number;
      };
      "7": {
        s: number;
      };
      "8": {
        s: number;
      };
    };
  }): {
    table_id: string;
    imageId: string;
    filename: string;
    mimeType: string;
    positioning: {
      position: {
        left: number;
        top: number;
      };
      scale: {
        x: number;
        y: number;
      };
      rotation: number;
    };
    effects: {
      [effectType in ImageEffectTypes]: boolean;
    };
    effectStyles: ImageEffectStylesType;
  } => {
    const { tid, iid, n, m, p, e, es } = data;

    const effects = Object.keys(imageEffectEncodingMap).reduce((acc, key) => {
      const value = imageEffectEncodingMap[key as ImageEffectTypes];
      acc[key as ImageEffectTypes] = e.includes(value);
      return acc;
    }, {} as Record<ImageEffectTypes, boolean>);

    return {
      table_id: tid,
      imageId: iid,
      filename: n,
      mimeType: m,
      positioning: {
        position: {
          left: p.p.l,
          top: p.p.t,
        },
        scale: {
          x: p.s.x,
          y: p.s.y,
        },
        rotation: p.r,
      },
      effects,
      effectStyles: {
        postProcess: {
          style: postProcessEffectDecodingMap[es["0"].s],
        },
        hideBackground: {
          style: hideBackgroundEffectDecodingMap[es["1"].s],
          color: es["1"].c,
        },
        tint: {
          color: es["2"].c,
        },
        glasses: {
          style: glassesEffectDecodingMap[es["3"].s],
        },
        beards: {
          style: beardsEffectDecodingMap[es["4"].s],
        },
        mustaches: {
          style: mustachesEffectDecodingMap[es["5"].s],
        },
        masks: {
          style: masksEffectDecodingMap[es["6"].s],
        },
        hats: {
          style: hatsEffectDecodingMap[es["7"].s],
        },
        pets: {
          style: petsEffectDecodingMap[es["8"].s],
        },
      },
    };
  };
}

export default Decoder;
