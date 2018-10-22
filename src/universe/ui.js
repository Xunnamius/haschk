/* @flow */

// TODO: document me or remove me
export const icons = {
    neutral: 'neutral',
    safe: 'safe',
    unsafe: 'unsafe'
};

// ? Create a Flow-enforced enum type based on the `icons` constant above
// ? See https://flow.org/en/docs/types/utilities/#toc-keys for details
export type Icon = $Keys<typeof icons>;

// TODO: is this code useful or should it all be removed, @morty-c137-prime?
export const getIcon = (iconType: Icon) => {
    if(!icons[iconType])
        throw Error(`requested invalid icon type "${iconType}"`);

    return {
        '16' : `assets/icon/${iconType}/16x16.png`,
        '57' : `assets/icon/${iconType}/57x57.png`,
        '120' : `assets/icon/${iconType}/120x120.png`,
        '310' : `assets/icon/${iconType}/310x310.png`
    };
};
