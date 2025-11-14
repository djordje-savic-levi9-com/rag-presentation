export type Tournament = {
    year: number;
    hosts: string[];
    winner: string;
    runnerUp: string;
    thirdPlace: string;
};

export const dataset: Tournament[] = [
    {
        year: 2025,
        hosts: ['Cyprus', 'Finland', 'Latvia', 'Poland'],
        winner: 'Germany',
        runnerUp: 'Turkey',
        thirdPlace: 'Greece',
    },
    {
        year: 2022,
        hosts: ['Georgia', 'Czech Republic', 'Germany', 'Italy'],
        winner: 'Spain',
        runnerUp: 'France',
        thirdPlace: 'Germany',
    },
    {
        year: 2017,
        hosts: ['Finland', 'Israel', 'Romania', 'Turkey'],
        winner: 'Slovenia',
        runnerUp: 'Serbia',
        thirdPlace: 'Spain',
    },
    {
        year: 2015,
        hosts: ['France', 'Croatia', 'Latvia', 'Germany'],
        winner: 'Spain',
        runnerUp: 'Lithuania',
        thirdPlace: 'France',
    },
    {
        year: 2013,
        hosts: ['Slovenia'],
        winner: 'France',
        runnerUp: 'Lithuania',
        thirdPlace: 'Spain',
    },
    {
        year: 2011,
        hosts: ['Lithuania'],
        winner: 'Spain',
        runnerUp: 'France',
        thirdPlace: 'Russia',
    },
    {
        year: 2009,
        hosts: ['Poland'],
        winner: 'Spain',
        runnerUp: 'Serbia',
        thirdPlace: 'Greece',
    },
    {
        year: 2007,
        hosts: ['Spain'],
        winner: 'Russia',
        runnerUp: 'Spain',
        thirdPlace: 'Lithuania',
    },
    {
        year: 2005,
        hosts: ['Serbia and Montenegro'],
        winner: 'Greece',
        runnerUp: 'Germany',
        thirdPlace: 'France',
    },
    {
        year: 2003,
        hosts: ['Sweden'],
        winner: 'Lithuania',
        runnerUp: 'Spain',
        thirdPlace: 'Italy',
    },
    {
        year: 2001,
        hosts: ['Turkey'],
        winner: 'Yugoslavia',
        runnerUp: 'Turkey',
        thirdPlace: 'Spain',
    },
];
