'use strict'

const config = {
    application: {
        host: 'localhost',
        port: process.env.NODE_PORT || 3000,
        protocol: 'http'
    },
    client: {
        host: 'localhost',
        port: 8080,
        protocol: 'http'
    },
    database: {
        name: 'hypertube',
        host: 'ds237848.mlab.com:37848'
    },
    mail: {
        from: 'hypertube@42.fr',
        service: 'gmail'
    },
    omDB: {
        host: 'http://www.omdbapi.com/'
    },
    openSubtitles: {
        username: 'abanvill'
    },
    oauth: {
        '42': {
            auth: {
                redirectURI: 'http://localhost:8080/oauth/42/',
                tokenHost: 'https://api.intra.42.fr/'
            },
            client: {
                id: 'bcbec73e930f075dcd1c7295fc647d93a27bda3b5a53333c068c40383e3b2f2f'
            },
            url: 'https://api.intra.42.fr/v2/me'
        },
        'FB': {
            auth: {
                redirectURI: 'http://localhost:3000/auth/facebook/callback'
            },
            client: {
                id: '858111651027499'
            }
        },
        'Google': {
            auth: {
                redirectURI: 'http://localhost:3000/auth/google/callback'
            },
            client: {
                id: '243124008000-72pa29tmdmckuj21uqa4a6iou4rsis40.apps.googleusercontent.com'
            }
        },
        'Github': {
            auth: {
                redirectURI: 'http://localhost:3000/auth/github/callback'
            },
            client: {
                id: 'd258f1bb5521e519feb4'
            }
        },
        'Instagram': {
            client: {
                id: '1a28812669a8491aa7890cb28d24d6a2'
            }
        }
    },
    prettyLog: process.env.NODE_ENV == 'development'
}
module.exports = config