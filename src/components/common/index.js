// TODO: Make this modular
export const icons =
{
    neutral: 'neutral',
    safe: 'safe',
    unsafe: 'unsafe'
};

export const getIcon = (iconType) => {
    if(!icons[iconType])
        throw Error("Not valid icon type.")
    return {
        16: `assets/icon/${iconType}/16x16.png`,
        57: `assets/icon/${iconType}/57x57.png`,
        120: `assets/icon/${iconType}/120x120.png`,
        310: `assets/icon/${iconType}/310x310.png`
    }
};
