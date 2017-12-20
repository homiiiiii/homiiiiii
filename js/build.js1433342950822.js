var Project = {
    slug: 'dennis',
    title: 'DENNIS / popcorn_10 / Always & Forever / NHX',
    release: '',
    artist: '',
    director: '@georgealways',
    description: 'An interactive, audio-responsive music video for popcorn_10\'s "Dennis", directed by Always &amp; Forever Computer Entertainment and presented by NHX.', 
    url: 'http://www.dennis.video',
    bpm: 74,
    bar: 4,
    duration: 149.26365,
    soundcloud_id: '',
    twitter_publisher_handle: '',
    twitter_author_handle: '',
    fb_author_page: '',
    fb_publisher_page: '',
    fb_admins: '',
    fb_app_id: '',
    gplus_author_page: '',
    gplus_publisher_page: '',
    analytics_id: 'UA-63658978-1', 

    nhx_url: 'http://chordslayer.com/'
    
};

!this.Element && ( module.exports = Project );
var USE_SOUNDCLOUD = url.boolean( 'sc', false );

// Customizable
// ------------------------------- 

// If true, displays seekbar and play button
var USES_TIMELINE = true;

// Aspect ratio of stage, ignored if STAGE_FLUID
var STAGE_ASPECT_RATIO = 16 / 9;

// If true, uses locked aspect ratio
var STAGE_FLUID = false; // todo

// Ignored if STAGE_FLUID
var STAGE_ORIENTATION_LOCK = 'landscape'; // todo

// True if user needs to interact with the stage.
var INTERACTIVE = true; // todo

// Show the previous next and small play buttons
var DISPLAY_PREV_NEXT = false; // todo

// Forces crop if letterbox spacing is smaller than this value
var PINNED_PADDING = 20;

        
// Feel
// ------------------------------- 

var MOUSE_EASING = 0.02;
var TILT_EASING = 0.2;

// Time in ms until controls disappear
var IDLE_TIMEOUT = 500;

// Time after idle switches until idle can switch again
var IDLE_GRACE_PERIOD = 1200;


// ===============================



// Flags
// ------------------------------- 

var DEBUG_ENABLED = true; // todo

var AUTO_PLAY = false;
var AUTO_TIME = 0;
var AUTO_TIME_UNIT = 'seconds';
var MUTE = false;

if ( DEBUG_ENABLED ) {

    AUTO_PLAY = url.boolean( 'p' );
    AUTO_TIME = url.number( 't' ) || url.number( 'r' ) || url.number( 'b' );
    AUTO_TIME_UNIT = url.r ? 'bars' : 0 || url.b ? 'beats' : 0 || 'seconds';
    MUTE = url.boolean( 'm', false );

}

// Enums
// -------------------------------

var DEBUG    = 'Debug';
var MOUSE    = 'Mouse';
var TILT     = 'Tilt';
var VR       = 'Vr';

var OCULUS   = 'OculusRift';
var STEREO   = 'Stereo';
var ANAGLYPH = 'Anaglyph';


// Sniff sniff ...
// -------------------------------

var UA = navigator.userAgent;

var ANDROID    = !!UA.match( /Android/ig );
var BLACKBERRY = !!UA.match( /BlackBerry/ig );
var IOS        = !!UA.match( /iPhone|iPad|iPod/ig );
var OPERAMINI  = !!UA.match( /Opera Mini/ig );
var IEMOBILE   = !!UA.match( /IEMobile/ig );
var WEBOS      = !!UA.match( /webOS/ig );


var ARORA      = !!UA.match( /Arora/ig );
var CHROME     = !!UA.match( /Chrome/ig );
var EPIPHANY   = !!UA.match( /Epiphany/ig );
var FIREFOX    = !!UA.match( /Firefox/ig );
var IE         = !!UA.match( /MSIE/ig );
var MIDORI     = !!UA.match( /Midori/ig );
var OPERA      = !!UA.match( /Opera/ig );
var SAFARI     = !!UA.match( /Safari/ig );


var HANDHELD  = ANDROID || BLACKBERRY || IOS || OPERAMINI || IEMOBILE || WEBOS;
var TOUCH = 'ontouchstart' in window;
var WEBGL = (function() { try { return !!window.WebGLRenderingContext && !!(document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl')); } catch(e) { return false; } })();
var ACCELEROMETER = !!window.DeviceOrientationEvent;


;( function( scope ) {
    if ( WEBGL ) { 
        var ctx = document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl')
        scope.GPU = ctx.getParameter( ctx.VERSION );
    } else { 
        scope.GPU = null;
    }
} )( this );

[ 'HANDHELD', 'TOUCH', 'WEBGL', 'ACCELEROMETER' ].forEach( function( val ) { 
    document.body.classList.toggle( val.toLowerCase(), this[ val ] );
}, this );


// Device
// -------------------------------

var DEFAULT_SYNC = 0.195;

var DEVICE_SYNC_DB = {
    'iPhone OS 8_': 0.229
};


// Math
// ------------------------------- 

var TWO_PI     = Math.PI * 2;
var PI         = Math.PI;
var HALF_PI    = Math.PI * 0.5;
var QUARTER_PI = Math.PI * 0.25;
var RADIANS    = 180 / Math.PI;

var SQRT_HALF  = Math.sqrt( 0.5 );


// Debug
// ------------------------------- 

// Serialize the camera state in the URL when using Controls
var URL_SAVE_CAMERA = false;

// Width of metronome column
var DEBUG_BEAT_COLUMN = 25;

// Colors to use for debug mode
var DEBUG_COLORS = [
    '#EC008B',
    '#FF3000',
    '#FFB600',
    '#FFF000',
    '#00FF67',
    '#00ADEF',
    '#A100FF',
];
;( function( scope ) {

    scope.Assets = function( asset ) {
        
        // refer to loaded assets with or without path bangs
        // so you can load and request assets with the same string
        asset = asset.substring( asset.indexOf( '!' ) + 1 );

        if ( !Assets.loaded[ asset ] ) {
            console.error( 'Request for unloaded asset: ' + asset );
            return;
        }

        return Assets.loaded[ asset ];

    };

    _.extend( Assets, {

        Types: {},
        loaded: {},
        promises: {},
        basePath: '',

        getExtension: function( path ) {
            return /(?:\.([^.]+))?$/.exec( path )[ 1 ];
        },

        getType: function( pathBang ) {
            
            var loader;
            var path = pathBang;
            var bang = /^(.*)!(.*)/.exec( pathBang );

            if ( bang ) {
                loader = Assets.Types[ bang[ 1 ] ];
                path = bang[ 2 ];
            } else {
                loader = Assets.Types[ Assets.getExtension( pathBang ) ];
            }

            if ( !loader ) {
                console.error( 'Unrecognized file type: ' + pathBang );
                return;
            }

            return { loader: loader, path: path };

        },

        load: function( args ) {

            args = _.defaults( args, {
                files: [],
                basePath: Assets.basePath,
                progress: function() {}
            } );

            var loaded = 0;
            var promises = [];

            args.files.forEach( function( pathBang ) { 
                
                var type = Assets.getType( pathBang );
                var loader = type.loader;
                var path = type.path;

                var promise = Assets.promises[ path ];
                
                if ( !promise ) {
                    
                    promise = Assets.promises[ path ] = new Promise();
                    
                    loader( args.basePath + path, function( asset ) {
                        Assets.loaded[ path ] = asset;
                        promise.resolve();
                    } );

                }

                promise.then( function() {
                    loaded++;
                    args.progress( loaded / args.files.length, loaded, args.files.length );
                } );                

                promises.push( promise );

            } );

            return Promise.all( promises );

        }

    } );

} )( this );

;( function( scope ) {

    var Types = scope.Assets.Types;
    

    // Plain Text
    // ------------------------------- 

    Types.text = get;
    Types.vs = get;
    Types.fs = get;
    Types.glsl = get;
    Types.woff2 = get;

    Types.json = function( url, load, error ) {
        get( url, function( text ) {
            load( JSON.parse( text ) );
        }, error );
    };


    // CSV
    // ------------------------------- 

    Types.csv = function( url, load, error ) {
    
        get( url, function( text ) {
            
            var lines = text.split( '\n' );
            var columns = lines[ 0 ].split( ',' );

            lines = lines.slice( 1 );
            lines.forEach( function( line, i ) {

                var cells = line.split( ',' );
                var obj = {};

                cells.forEach( function( val, i ) {

                    var col = columns[ i ];
                    if ( col.toLowerCase() == 'time' ) {
                        var match = val.match( /(\d+):(\d+).(\d+)/ );
                        if ( match ) {
                            var millis = parseInt( match[ 3 ] );
                            var seconds = parseInt( match[ 2 ] );
                            var minutes = parseInt( match[ 1 ] );
                            obj.time = Time.seconds( seconds + millis / 1000 + minutes * 60 );
                        }
                    }
                    obj[ col ] = val;

                } );

                lines[ i ] = obj;
            } );
            
            lines.columns = columns;

            load( lines );

        }, error );
        
    };


    // Volume
    // ------------------------------- 

    Types.volume = function( url, load, error ) {
    
        var volume = {};

        get( url, function( text ) {
            var json = JSON.parse( text );
            for ( var name in json ) {
                volume[ name ] = new Volume( json[ name ] ); 
            }
            load( volume );
        }, error );

        
    };


    // Images
    // ------------------------------- 

    Types.png = image;
    Types.jpg = image;
    Types.jpeg = image;
    Types.gif = image;

    function image( path, load ) {
        var img = new Image();
        img.onload = function() { 
            load( img );
        };
        img.src = path;
    };


    // Binary
    // ------------------------------- 

    Types.buffer = getBuffer;

    Types.mid = function( path, load, error ) { 
        getBuffer( path, function( buffer ) {
            load( new MIDIFile( buffer ) );
        }, error )
    };


    // three.js
    // ------------------------------- 

    if ( scope.THREE ) {

        Types.texture = function( path, load, error ) {
            THREE.ImageUtils.loadTexture( path, THREE.UVMapping, load, error );
        }

        Types.texturecube = function( path, load, error ) {
            var paths = [];
            _.each( [ 'px', 'nx', 'py', 'ny', 'pz', 'nz' ], function( suf ) {
                paths.push( path.replace( '*', suf ) );
            } );
            THREE.ImageUtils.loadTextureCube( paths, THREE.UVMapping, load, error );
        }

        if ( THREE.OBJLoader ) {
            
            var loader = new THREE.OBJLoader();

            Types.obj = function( url, load, error ) {
                loader.load( url, load );
            };

        }

    }


    // pixi.js
    // ------------------------------- 

    if ( scope.PIXI ) {

        Types.sprite = function( path, load, error ) {

            var loader = new PIXI.ImageLoader( path );
            loader.onLoaded = function() {
                load( new PIXI.Sprite( PIXI.TextureCache[ path ] ) );
            };
            loader.load();

        };

        Types.spritesheet = function( path, load, error ) {
        
            var size = 2048; // todo

            var ogPath = path.toString();

            path = path.replace( '{s}', size );
            path = path.replace( '{n}', 0 );

            path += '.json';

            get( path, function( text ) {

                var json = JSON.parse( text );
                var sheets = _.map( _.range( json.sheets ), function( n ) {
                
                   return ogPath.replace( '{s}', size ).replace( '{n}', n ) + '.json'; 
                    
                } );

                var loader = new PIXI.AssetLoader( sheets );
                loader.onComplete = load;
                loader.load();

            }, error );            

        };

    }
    

    // Sound Manager
    // ------------------------------- 

    // if ( scope.soundManager ) {

    //     var soundManagerStarted = false;

    //     var promise = new Promise();

    //     if ( !soundManagerStarted ) {

    //         soundManagerStarted = true;

    //         soundManager = new SoundManager();

    //         soundManager.useHighPerformance = true;
    //         soundManager.useFastPolling = true;
    //         soundManager.useHTML5Audio = true;
    //         soundManager.onready( promise.resolve );

    //         soundManager.url = Assets.basePath + 'swf/';
    //         soundManager.beginDelayedInit();

    //     }

    //     var sound = function( url, load, error ) {
    //         promise.then( function() {
    //             var name = url;
    //             var s = soundManager.createSound( {
    //                 url: url,
    //                 stream: true,
    //                 autoLoad: true,
    //                 onload: function() {
    //                     // console.log( 'sound loaded', s );
    //                 }
    //             } );
    //             load( s );
    //         } );
    //     };

    //     Types.mp3 = sound;
    //     Types.ogg = sound;
    //     Types.wav = sound;

    // }
    
    if ( USE_SOUNDCLOUD ) { 

        SC.initialize( {
          client_id: "ed034dcadbbd510234561d90b4ef5868"
        } );

        Types.mp3 = function( url, load, error ) {

            SC.whenStreamingReady( function() {
                SC.stream( '/tracks/208519540?secret_token=s-v7Hc6', {
                    autoLoad: true, 
                }, function( sound ) {
                    load( sound );
                } )
            } );
            
        }


    } else {


        var sound = function( url, load, error ) {
            var audio = document.createElement( 'audio' );
            audio.setAttribute( 'preload', 'auto' );
            audio.setAttribute( 'src', url );
            load( audio );
        };

        Types.mp3 = sound;
        Types.ogg = sound;
        Types.wav = sound;

    }


} )( this );
var Behavior = Composition( 

    Events,

    function() {

        this.active = false;
        this.paused = false;
        this.now = 0;

    },

    {
        _update: function() {


            this.now = Player.now - this.in;
            if ( this.duration !== undefined && this.now > this.duration ) {
                return this.stop();
            }
            this.frames++;
            this.update();
        },

        _on: function() {
            Loop.on( 'update', this._update, this );
        },

        _off: function() {
            Loop.off( 'update', this._update, this );
        },

        update: function() {},

        start: function() {
            
            if ( this.active ) {
                this.in = undefined;
                this.out = undefined;
                this.stop();
            }
            
            if ( this.in === undefined ) {
                this.in = Player.now;
            }

            if ( this.out !== undefined ) {
                this.duration = this.out - this.in;
            } else if ( this.duration !== undefined ) {
                this.out = this.in + this.duration;
            }

            this.active = true;
            this.frames = 0;
            this.now = 0;
            this._on();
            this.trigger( 'start' );

        },
        
        pause: function() {
            if ( !this.active || this.paused ) return;  
            this.paused = true;
            this._off();
            this.trigger( 'pause' );
        },

        resume: function() {
            if ( !this.active || !this.paused ) return;
            this.paused = false;
            this._on();
            this.trigger( 'resume' );
        }, 

        stop: function() {
            if ( !this.active ) return;
            this.active = false;
            this.paused = false;
            this._off();
            this.trigger( 'stop' );
        }

    } 

);
;( function( scope ) {

    scope.Bootstrap = Singleton( 
        
        Events,
        
        {

            paths: {
                midi: 'mid/' + Project.slug + '.mid',
                mp3: 'mp3/' + Project.slug + '.mp3',
                csv: 'csv/' + Project.slug + '.csv', 
                peaks: 'peaks/' + Project.slug + '.json',
                volumes: 'volume!volume/' + Project.slug + '.json'
            },

            setProgress: function( pct ) {
                progress.style.transform = 
                progress.style.webkitTransform = 
                'scale( ' + pct + ', 1 )';
            }, 

            init: function( files, callback ) {

                Bootstrap.trigger( 'init' );

                files = files.concat( _.values( Bootstrap.paths ) );
                
                Assets.load( {

                    files: files,
                    basePath: 'assets/',
                    progress: function( pct ) {
                        Bootstrap.setProgress( pct * 0.25 );
                    }

                } ).then( function() {

                    scope.Midi    = Assets( Bootstrap.paths.midi );
                    scope.Csv     = Assets( Bootstrap.paths.csv );
                    scope.Volumes = Assets( Bootstrap.paths.volumes );
                    scope.Peaks   = Assets( Bootstrap.paths.peaks );

                    Bootstrap.trigger( 'load' );

                    callback();

                    Bootstrap.trigger( 'done' );

                } );

            }

        }

    );
    
} )( this );
;( function( scope ) {

    
    var canvas = document.getElementById( 'debug-canvas' );
    var ctx = canvas.getContext( '2d' );
    
    scope.Debug = Singleton( 
        Behavior,
        {
            canvas: canvas,
            ctx: ctx,
            enabled: false,
            toggle: toggle,
            start: start,
            stop: stop,
            clear: clear,
            update: update    
        }
    );

    var syncDir = 0;
    var initted = false;

    function toggle() {
        if ( container.classList.contains( 'debug' ) ) {
            Debug.stop();
        } else {
            Debug.start();
        }
        Loop.force();
    } 

    function start() {

        if ( !initted ) {
            init();
        }

        document.getElementById( 'quarter-note' ).innerHTML = ( 60 / Project.bpm ).toFixed( 3 );

        container.classList.add( 'debug' );
        Loop.on( 'beforeupdate', Debug.clear );
            
    }

    function stop() {
        container.classList.remove( 'debug' );
        Loop.off( 'beforeupdate', Debug.clear );
        Debug.clear();
    } 

    function clear() {
        ctx.clearRect( 0, 0, canvas.width, canvas.height );
    } 

    function update() {

        offsetSync( 0.001 * syncDir );

        var beats = 8;

        var h = Math.floor( DEBUG_BEAT_COLUMN / 2 );

        for ( var i = 0; i < beats; i++ ) {

            var div = Math.pow( 2, i );

            var color = DEBUG_COLORS[ i % DEBUG_COLORS.length ];

            var on = Math.ceil( Player.now / Time.div( div ) ) % 2 == 0;
            ctx.globalAlpha = 1;

            var x = Math.ceil( Stage.width / 2 ) + 3;
            var w = Math.ceil( DEBUG_BEAT_COLUMN / 2 ) ;
            var y = Math.ceil( i * ( h + 1 ) );

            ctx.fillStyle = !on ? '#000' : color;
            ctx.fillRect( x - 1, y, w, h );

        }

        on = Math.ceil( Player.now / Time.bars( 1 ) ) % 2 == 0;
        h *= beats;
        h += beats - 1;
        w = Math.ceil( DEBUG_BEAT_COLUMN / 2 );
        y = 0;
        x = Math.ceil( Stage.width / 2 + DEBUG_BEAT_COLUMN / 2 ) + 3;

        ctx.fillStyle = !on ? '#000' : '#fff';
        ctx.fillRect( x, y, w, h );

        var numStems = _.keys( Volumes ).length;

        w = Math.ceil( Stage.width / ( Math.round( numStems / 2 ) * 2 ) );
        i = 0;

        for ( var stem in Volumes ) {

            y = i > numStems / 2 ? Stage.height / 2 : Stage.height;
            ii = i;
            if ( i > numStems / 2 ) {
                ii -= Math.ceil( numStems / 2 ); 
            }

            var amp = Volumes[ stem ];

            var smooth = amp.at( Player.now, amp.smoothing );
            var vol = amp.at( Player.now );


            var h = Math.ceil( vol * Stage.height / 2 );
            var h2 = Math.ceil( smooth * Stage.height / 2 )

            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#666';
            ctx.fillRect( Math.ceil( Stage.width / 2 + w * ii - w * 3) + 1, Math.ceil( y - h ), w - 1, h );


            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#666';
            ctx.fillRect( Math.ceil( Stage.width / 2 + w * ii - w * 3) + 1, Math.ceil( y - h2 ), w - 1, h2 - h );

            ctx.globalAlpha = 0.6;
            ctx.save();
            ctx.fillStyle = '#666'
            ctx.textAlign = 'right';
            ctx.translate( Math.ceil( Stage.width / 2 + w * ii + 1 + w / 2 - w * 3 ) + 0.5, y - 20.5 );
            ctx.rotate( Math.PI / 4 );
            ctx.fillText( stem, 0, 0 );
            ctx.restore();


            if ( vol > amp.gate && vol * amp.thresh > smooth ) {


                ctx.globalAlpha = 1;
                ctx.fillStyle = DEBUG_COLORS[ i % DEBUG_COLORS.length ];
                ctx.fillRect( Math.ceil( Stage.width / 2 + w * ii ) + 1, y - Stage.height / 2, w - 1, Math.ceil( Stage.height / 2 ) );

            }


            i++;

        }
        
    } 
    
    function debugPeaks() {
        
        setTimeout( function() {
            
            var i = 0;

            _.each( Volumes, function( v ) {
                
                ( function( i ) {
                
                    v.peaks.forEach( function( p ) {
                    
                        peakEvent( p, i );
                        
                    } );
                    
                } )( i++ );
                
                
            } );
            
        }, 500 )

        
        function peakEvent( e, i ) {

            var opacity = { value: 1 }, width, w, y, ii;
            
            var numStems = _.keys( Volumes ).length;
            var n = numStems / 2;

            Player.timeline.fromTo( opacity, 0.02, { value: 1 }, {

                value: 1,

                onUpdate: function() {

                    if ( !Debug.active ) return;

                    w = Math.ceil( Stage.width / ( Math.round( n ) * 2 ) );

                    y = i > n ? 0 : Stage.height / 2;
                    ii = i;
                    if ( i > n ) {
                        ii -= Math.ceil( n ); 
                    }

                    ctx.globalAlpha = 1;
                    ctx.fillStyle = DEBUG_COLORS[ i % DEBUG_COLORS.length ];
                    ctx.fillRect( Math.ceil( Stage.width / 2 + w * ii - w * 3 ) + 1, y, w - 1, Stage.height / 2 );


                },

                ease: Expo.easeOut

            }, e );

        }
        
    } 


    function init() {

        initted = true;

        numStems = _.keys( Volumes ).length;
        
        debugCsv();
        debugSync();
        debugPeaks();
        
        Midi.query( { type: 'noteOn' } ).forEach( debugMidi );
        
        
    };

    function debugCsv() {
        
        var csvDisplay = document.getElementById( 'debug-csv' );

        var lastRow;

        Csv.forEach( function( row, c ) {

            var lines = [];

            for ( var col in row ) {
                lines.push( '<dt id="csv-' + col + '">' + col + '</dt><dd>' + row[ col ] + '</dd>' );
            }

            var str = lines.join( '\n' );


            Player.timeline.call( function() {
            
                if ( !Debug.active ) return;

                csvDisplay.innerHTML = str
                
                for ( var col in row ) {
                    if ( lastRow && lastRow[ col ] !== row[ col ] ) {

                        ( function( el ) {
                            
                            el.style.opacity = 1;
                            _.defer( function() {
                                el.style.opacity = '';
                            } );                            
                        
                        } )( document.getElementById( 'csv-' + col ) );

                    }
                }

                lastRow = row;

                
            }, [], this, row.time );

        } );

    } 

    function debugMidi( e ) {

        var noteRange = 50;

        var opacity = { value: 1 }, width, w, t, c, h, y;

        var start = 1;//Math.max( 0.5, e.velocity / 100 );
        Player.timeline.fromTo( opacity, 0.02, { value: start }, {

            value: 1,

            onUpdate: function() {

                if ( !Debug.active ) return;

                width = Stage.width / 2;

                w = Math.floor( Math.min( width / ( Midi.tracks.length - 1 ) ), width / 2 );
                t = ( e.track || 1 ) - 1;

                c = Math.round( t / ( Midi.tracks.length - 1 ) * 360 ); 
                h = 1;

                y = Math.floor( map( e.note, 60 + noteRange, 60 - noteRange, 0, Stage.height ) );

                ctx.globalCompositeOperation = 'source-over';

                ctx.globalAlpha = opacity.value;
                ctx.fillStyle = DEBUG_COLORS[ t % DEBUG_COLORS.length ];
                ctx.fillRect( w * t, 0, w - 1, Stage.height );

                ctx.globalAlpha = Math.pow( opacity.value, 3 );
                ctx.fillStyle = '#fff';
                // ctx.fillRect( w * t, 0, w - 1, Stage.height );

                ctx.globalAlpha = 1;
                ctx.fillStyle = 'rgba( 255, 255, 255, ' + opacity.value + ' )';
                ctx.fillRect( w * t, y, w - 1, h );

            },

            ease: Expo.easeOut

        }, e.time );

    }

    function debugSync() {
    
        var syncUp = document.getElementById( 'sync-up' );
        var syncDown = document.getElementById( 'sync-down' );
        var debugSync = document.getElementById( 'debug-sync' );

        new Hammer( debugSync ).on( 'tap', function( e ) {
        
            if ( e.tapCount == 2 ) {
                offsetSync( -Device.sync );
            }
            
        } )

        function _offsetSync( dir ) {
            return function( e ) {
                Player.play();
                debugSync.classList.remove( 'hidden' );
                syncDir = dir;
            } 
        } 

        function syncEnd( e ) {
            e.stopPropagation();
            debugSync.classList.add( 'hidden' );
            syncDir = 0;
        } 


        if ( TOUCH ) syncUp.addEventListener( 'touchstart', _offsetSync( 1 ), false );
        else syncUp.addEventListener( 'mousedown', _offsetSync( 1 ), false );

        if ( TOUCH ) syncUp.addEventListener( 'touchend', syncEnd, false );
        else syncUp.addEventListener( 'mouseup', syncEnd, false );
        
        if ( TOUCH ) syncDown.addEventListener( 'touchstart', _offsetSync( -1 ), false );
        else syncDown.addEventListener( 'mousedown', _offsetSync( -1 ), false );

        if ( TOUCH ) syncDown.addEventListener( 'touchend', syncEnd, false );
        else syncDown.addEventListener( 'mouseup', syncEnd, false );
        
    } 

    function offsetSync( delta ) {
    
        Device.sync += delta;
        document.getElementById( 'sync-display' ).innerHTML = Device.sync.toFixed( 3 );    
        
    } 


} )( this );
;( function( scope ) {
    
    var syncMatch = 'default';

    scope.Device = {

        sync: ( function() {
        
            var sync = DEFAULT_SYNC;

            for ( var match in DEVICE_SYNC_DB ) {
                if ( UA.indexOf( match ) !== -1 ) {
                    sync = DEVICE_SYNC_DB[ match ];
                    syncMatch = match;
                }
            }

            return sync;
            
        } )(),
        
    };

    document.getElementById( 'sync-display' ).innerHTML = Device.sync;
    document.getElementById( 'sync-match' ).innerHTML = syncMatch;
    document.getElementById( 'user-agent' ).innerHTML = UA;

} )( this );
var Loader = {

    el: document.querySelector( '#loader' ),
    elProgress: document.querySelector( '#loader-progress' ),

    pct: 0,
    t: 0,
    loading: false,

    progress: function( pct, loaded, count ) {
        Loader.pct = pct;
    },

    start: function() {
        Loader.el.classList.add( 'started' );
        Loader.el.classList.add( 'loading' );
        Loader.elProgress.style.transform = 'matrix(1, 0, 0, 0, 0, 0)';
        Loader.loading = true;
        setTimeout( Loader.update, 1500 );
    },

    update: function() {
        if ( !Loader.loading ) return;
        Loader.animationFrame = requestAnimationFrame( Loader.update );
        var y = 427.5;
        Loader.t += ( Loader.pct - Loader.t ) * 0.1;
        Loader.elProgress.style.transform = 'matrix(1, 0, 0, ' + Loader.t + ', 0, ' + ( y - Loader.t * y ) + ')';  
    },

    finish: function() {
        Loader.loading = false;
        Loader.el.classList.add( 'finished' );
        cancelAnimationFrame( Loader.update );
    },

    error: function() {
        
    }

};
;( function( scope ) {
    
    scope._Loop = Composition( 

        Events,

        function() {

            this.delta = 0;
            this.playing = false;
            this.prevNow = 0;
            this.now = 0;

            this.force = _.debounce( this.force, 0 );

        },

        {
            stop: function() {

                if ( RAF ) cancelAnimationFrame( this.request );
                else TweenLite.ticker.removeEventListener( 'tick', this.loop );
                // 
                if ( !this.playing ) return;


                this.playing = false;
                this.trigger( 'stop' );

            },

            start: function() {

                if ( this.playing ) return;

                if ( RAF ) {
                    this.request = requestAnimationFrame( this.loop );
                    console.trace( 'wtf' );
                } else {
                    TweenLite.ticker.addEventListener( 'tick', this.loop );
                }

                this.playing = true;
                this.now = this.prevNow = now();
                this.trigger( 'start' );
                this.loop();


            },

            force: function() {
                if ( !this.playing ) {
                    this.delta = 0;
                    this.trigger( 'beforeupdate' );
                    this.trigger( 'update' );
                }
            },

            loop: function () {

                if ( this.frozen ) { 
                    return;
                }
                this.prevNow = this.now;
                this.now = now();
                this.delta = this.now - this.prevNow;
                this.trigger( 'beforeupdate' );
                this.trigger( 'update' );
                
            },

        } 

    );
    
    scope.Loop = new _Loop();

    var now; 

    if ( window.performance && _.isFunction( window.performance.now ) ) {
        now = function() {
            return performance.now() * 0.001;
        }
    } else if ( _.isFunction( Date.now ) ) {
        now = function() {
            return Date.now() * 0.001;
        }
    } else { 
        now = function() {
            return new Date().getTime() * 0.001;
        }
    }

} )( this );
;( function( scope ) {


    var sound;
    var smoother = new PlayheadSmoother();

    var recordPlayhead = 0;
    var recordDone = false;
    var recordIntroPauseTime = 10;
    var smoothed;
    var focusTimeout;
    

    Bootstrap.on( 'load', load );
    Bootstrap.on( 'done', done );

    scope.Player = Singleton( 
        
        Events,

        {

            playing: false,
            now: 0,
            prevNow: 0,
            delta: 0,

            playPause: playPause,
            play: play,
            pause: pause,

            setPosition: setPosition,

            // toggleFreeze: toggleFreeze,
            // freeze: freeze,
            // unfreeze: unfreeze

        }

    );

    function load() {

        sound = Assets( Bootstrap.paths.mp3 );
        
        window.sound = sound;

        if ( MUTE ) {
            sound.setAttribute( 'muted', 'muted' );
        }

        if ( !USE_SOUNDCLOUD && !RECORD_MODE ) {
            sound.addEventListener( 'ended', onEnded );
            sound.addEventListener( 'pause', onPause );
        }

        Player.timeline = new Timeline( { paused: true } );
        Player.timeline.time( 0, false );

        Loop.on( 'update', update );

        if ( AUTO_PLAY ) {
            Player.play();
        }

        if ( AUTO_TIME ) {
            Player.setPosition( Time[ AUTO_TIME_UNIT ]( AUTO_TIME ) );
        }


    } 

    function done() {
        Player.timeline.time( Player.timeline.time() + 0.0001, false );
        Loop.force();
    } 


    function play() {

        if ( Player.playing || Stage.frozen ) return;

        Player.playing = true;

        if ( url.r ) {
            Player.setPosition( Time[ AUTO_TIME_UNIT ]( AUTO_TIME ) );
        }

        if ( USE_SOUNDCLOUD ) {
            sound.play( {
                volume: MUTE ? 0 : 100,
                onfinish: onEnded
            })
        } else { 
            sound.play();
        }

        trackEvent( 'play' );

        onPlay();
        
    }

    function pause() {
        Player.playing = false;
        sound.pause();
        onPause();
    }

    function onEnded() {
        clearTimeout( focusTimeout );
        Loop.stop();
        Stage.showControls();
        Stage.freeze();
        Scene.camera.thetaRange = TWO_PI / 10;
        Scene.camera.phiRange = PI / 4;
        container.classList.add( 'end' );
        trackEvent( 'finish' );
        
        if ( RECORD_MODE ) {
            Three.stop();
            rendercan.grab();
        }

    }

    function playPause() {
        Player.playing ? Player.pause() : Player.play();
    }


    function setPosition( time ) {
        if ( USE_SOUNDCLOUD ) sound.setPosition( Time.to.millis( time ) );
        else sound.currentTime = time;
        Loop.force();
    }



    function update() {



        if ( RECORD_MODE ) { 
            smoothed = Math.max(0, Three.recordTime - recordIntroPauseTime );


            if ( Three.recordTime > 147 + recordIntroPauseTime && !recordDone ) {
                Loop.stop();
                recordDone = true;
                setTimeout( function() {
                    Three.stop();
                }, 1000 )

                setTimeout( function( ) { 
                    rendercan.grab();
                }, 3000 );
                
                setTimeout( function( ) { 
                    window.location.reload();
                }, 5000 );

            }
        } else { 


            clearTimeout( focusTimeout );
            if ( Player.playing ) {
                focusTimeout = setTimeout( pause, 1000 );
            }

            if ( USE_SOUNDCLOUD ) {
                smoothed = smoother.update( Time.millis( sound.position || 0 ) );
            } else { 
                smoothed = sound.currentTime;//smoother.update( sound.currentTime );
            }

        }

        if ( RECORD_MODE && recordDone ) {
            return;
        }


        Player.prevNow = Player.now;
        Player.now = clamp( smoothed + Device.sync, 0, Project.duration );
        Player.delta = Player.now - Player.prevNow;
        
        Player.timeline.time( Player.now, false );

    }


    function onPlay() {
        clearTimeout( focusTimeout );
        Player.trigger( 'play' );
        Loop.start();
    }

    function onPause() {
        clearTimeout( focusTimeout );
        Player.trigger( 'pause' );
        Loop.stop();
        smoother.clear();
    }


    function PlayheadSmoother() {
        var started = false;
        var MAX_LEAD = 15/60;
        var prevPosition, nextPosition, position = 0;
        var lead = 0;

        this.clear = function() {
            prevPosition = undefined;
        };

        this.update = function( p ) {
            p = p || 0;
            if ( p !== 0 ) {
                started = true;
            }
            if ( started && p === prevPosition ) {
                lead += Loop.delta;
                lead = Math.min( lead, MAX_LEAD );
                nextPosition = p + lead;
            } else  {
                lead = 0;
                nextPosition = p;
            }

            prevPosition = p;

            if ( nextPosition >= position ) {
                position = nextPosition
            }

            return position;
        };

    }
    
} )( this );
var Shot = Composition(

    Behavior,

    {

        active: {},
        count: 0,

        stopAll: function() {
            for ( var id in Shot.active ) {
                Shot.active[ id ].stop();
            }  
        }

    },

    function() {
        
        this.id = Shot.count++;
        this.camera = new Camera();
        this.container = new Group();
        this.timeline = new Timeline( { paused: true } );

        this._behaviors = [];

    },

    {

        behaviors: function( count, behavior, itr, context ) {
        
            for ( var i = 0; i < count; i++ ) {
                itr.call( context, this.behavior( behavior ) );
            }

        },

        behavior: function( behavior ) {
        
            var b = new behavior();
            this._behaviors.push( b );
            return b;
            
        },

        start: function() {


            Scene.camera = this.camera;
            this.camera.start();

            this.show();

            Shot.active[ this.id ] = this;

        },

        stop: function() {

            this.camera.stop();

            for ( var i = 0, l = this._behaviors.length; i < l; i++ ) {
                this._behaviors[ i ].stop();
            }

            this._behaviors.length = 0;
            this.hide();

            delete Shot.active[ this.id ];

        },

        update: function() {
            this.timeline.time( this.now, false );
        },

        show: function() {
            Scene.add( this.container );
        },

        hide: function() {
            Scene.remove( this.container );
        }

    }

);
;( function( scope ) {

    Bootstrap.on( 'init', init );
    Bootstrap.on( 'done', done );

    var frozenLoop = new _Loop();
    
    scope.Stage = Singleton(

        Events,

        {
            
            el: document.getElementById( 'container' ),
            canvas: document.getElementById( 'canvas' ),

            openCatalogue: openCatalogue,
            closeCatalogue: closeCatalogue,
            
            showControls: showControls,
            hideControls: hideControls,

            showAbout: showAbout, 
            hideAbout: hideAbout, 

            mouseX: 0,
            mouseY: 0,            

            // should probably be part of player?
            frozen: false,
            freeze: freeze,
            unfreeze: unfreeze,
            frozenLoop: frozenLoop, 
            toggleFreeze: toggleFreeze,

            // extends Events.on for special behavior for Stage.on( 'resize' ) ... 
            // binding to resize invokes the callback once in addition to binding
            // uses a promise to ensure the stage has been resized once beforehand
            on: function( e, fnc, ctx ) { 
                e === 'resize' && resizePromise.then( fnc );
            }

        }

    );

    var Stage = scope.Stage;

    var classList = Stage.el.classList;
    
    var resizePromise = new Promise();
    
    // var durRect = duration.getBoundingClientRect();
    // var posRect = position.getBoundingClientRect();

    var titleScreen = true;
    
    var controls = classList.contains( 'controls' );

    function init() {


        hammer( 'canvas' )          .on( 'tap', pressCanvas );
        // hammer( 'catalogue' )       .on( 'tap', toggleCatalogue );
        // hammer( 'logo' )            .on( 'tap', toggleCatalogue );
        // hammer( 'prev' )            .on( 'tap', Player.prev );
        // hammer( 'next' )            .on( 'tap', Player.next );
        // hammer( 'play-bottom' )     .on( 'tap', function() {
        //     Stage.unfreeze();
        // } );
        // hammer( 'play-pause' )      .on( 'tap', Player.playPause );
        hammer( 'big-play' )        .on( 'tap', unfreeze );
        // hammer( 'track-container' ) .on( 'tap panleft panright panup pandown', scrub )
        

        hammer( 'fb' ).on( 'tap', popup( 'https://www.facebook.com/sharer/sharer.php?u=' + Project.url, 550, 200, 'fb' ) );
        hammer( 'twitter' ).on( 'tap', popup( 'https://twitter.com/home?status=' + Project.url, 550, 225, 'twitter' ) );

        document.addEventListener( 'mouseout', function( e ) {
            !e.relatedTarget || e.relatedTarget.nodeName == "HTML" && hideControls();
        }, false );

        if ( !INTERACTIVE ) {
            window.addEventListener( 'mousemove', showControls, false );
        }

        window.addEventListener( 'mousemove', updateMousePosition, false );
        window.addEventListener( 'resize', triggerResize, false );
        // window.addEventListener( 'orientationchange', triggerResize, false );
        
        // Loop.on( 'update', updateSeekbar );
        
        Player.on( 'pause', onPause );
        Player.on( 'play', onPlay );

        // frozenLoop.on( 'update', checkOrientation );

        Stage.on( 'resize', onResize );

        classList.add( 'title-screen' );

        window.addEventListener( 'keydown', function( e ) {

            switch ( e.keyCode ){ 
                case 32: return Player.playPause();
            }

            if ( DEBUG_ENABLED ) { 
             
                switch( e.keyCode ) {

                    case 192: return Debug.toggle();
                    case 27: return toggleFreeze();

                    case 96: return Three.setEffect();
                    case 97: return Three.setEffect( OCULUS );
                    case 98: return Three.setEffect( STEREO );
                    case 99: return Three.setEffect( ANAGLYPH );

                    case 100: case 188: return Controls.setMode( DEBUG );
                    case 101: case 190: return Controls.setMode( MOUSE );
                    case 102: case 191: return Controls.setMode( TILT );    

                }   
                

            }

        }, false );

        // var art = document.getElementById( 'album-art' );
        // var artImg = art.querySelector( 'img' );
        // var panel = document.getElementById( 'panel-container' );

        // panel.addEventListener( 'scroll', function() {
        //     art.style.top = -panel.scrollTop / 2 + 'px';
        //     artImg.style.webkitFilter = 'blur( ' + cmap( panel.scrollTop, 0, panel.offsetWidth, 0, 10 ) + 'px )';
        // }, false );

    }

    function popup( url, w, h ) {
        return function() {
            var left = (screen.width/2)-(w/2);
            var top = (screen.height/2)-(h/2);
            return window.open(url, undefined, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left );
        }
    }

    function done() {
        
        triggerResize();
        
        classList.remove( 'hidden' );

    }

    function openCatalogue( e ) {
        if ( classList.contains( 'panel' ) ) return;
        showControls();
        classList.add( 'panel' );
        Player.pause();
    }
    
    function closeCatalogue() {
        if ( !classList.contains( 'panel' ) ) return;
        classList.remove( 'panel' );
    }

    function toggleCatalogue() {
        classList.contains( 'panel' ) ? closeCatalogue() : openCatalogue();
    }


    function toggleFreeze() {

        Stage.frozen ? unfreeze() : freeze();

    }

    function freeze() {

        if ( Stage.frozen ) return;
        
        Stage.frozen = true;




        frozenLoop.on( 'update', Controls.update, Controls );
        frozenLoop.on( 'update', Three.update, Three );

        frozenLoop.start();
        // Controls.start();

        Player.off( 'pause', onPause );
        Player.pause();

        // hideControls();

    } 

    function unfreeze( dontPlay ) {
        
        Stage.frozen = false;

        frozenLoop.off( 'update', Controls.update, Controls );
        frozenLoop.off( 'update', Three.update, Three );

        frozenLoop.stop();
        // Controls.stop();

        
        if ( dontPlay !== true ) {
            Player.on( 'pause', onPause );
            Player.play();
        }

    } 

    function onPlay() {
        Loop.off( 'update', checkOrientation );
        titleScreen = false;
        classList.add( 'playing' );
        classList.remove( 'title-screen' );
        classList.remove( 'paused' );
        setTimeout( closeCatalogue, 200 );
        hideControls();
    }

    function onPause() {
        classList.add( 'paused' );
        classList.remove( 'playing' );
        showControls();
    } 

    function showControls() {
        if ( Stage.frozen ) return;
        classList.add( 'controls' );
        Loop.on( 'update', updateSeekbar );
    } 

    function hideControls() {
        if ( Player.playing || Stage.frozen ) {
            classList.remove( 'controls' );
            Loop.off( 'update', updateSeekbar );
        }
    }

    function showAbout() {
        trackEvent( 'about' );
        Stage.unfreeze( true );
        document.getElementById('about').style.display = 'block';
    }

    function hideAbout() {
        document.getElementById('about').style.display = 'none';
        Stage.freeze();
    }

    
    function toggleControls() {
        classList.contains( 'controls' ) ? hideControls() : showControls();
    }

    function checkOrientation() {

        var holdingItWrong = HANDHELD 
            && titleScreen 
            && Accelerometer.orientation === 0.0.deg
            // && Math.abs( Accelerometer.gamma - Math.PI / 2 ) > Math.PI / 3;


        // if ( holdingItWrong ) {
        //     orientationMessage.style.display = 'block';
        // } else { 
            // orientationMessage.style.display = 'none';
        // }



    }

    function pressCanvas() {
        // toggleControls();
        showControls();
        Player.pause();
        closeCatalogue();
    }

    function updateSeekbar() {

        var posStr = timeString( Player.now );
        var durStr = timeString( Project.duration );
        var knobWidth = Player.now / Project.duration * 100 + '%';

        // if ( position.innerHTML !== posStr ) position.innerHTML = posStr;
        // if ( duration.innerHTML !== durStr ) duration.innerHTML = durStr;
        // if ( knob.style.width !== knobWidth ) knob.style.width = knobWidth;

    }

    function scrub( e ) {

        var max = Stage.portrait ? posRect.top : posRect.right;
        var min = Stage.portrait ? durRect.bottom : durRect.left;

        var val = Stage.portrait ? e.center.y : e.center.x;

        var p = map( val, max, min, 0, Project.duration );

        Player.setPosition( p );

    }

    function updateMousePosition( e ) {
        Stage.mouseX = e.clientX - Stage.left;
        Stage.mouseY = e.clientY - Stage.top;
    } 

    function triggerResize() {
        Stage.trigger( 'resize' );
    }


    function onResize() {

        var width = Math.min( Stage.el.parentElement.offsetWidth, window.innerWidth );
        var height = Math.min( Stage.el.parentElement.offsetHeight, window.innerHeight );
        
        Stage.portrait = HANDHELD && height >= width;

        var x =  Stage.portrait ? height : width;
        var y = !Stage.portrait ? height : width;

        var stageWidth = x;
        var stageHeight = x / STAGE_ASPECT_RATIO;

        var pinned = stageHeight >= y - ( header.offsetHeight * 2 + PINNED_PADDING )
        var pinnedSnapFill = pinned && stageHeight < y;

        var barHeight = header.offsetHeight + controls.offsetHeight;

        if ( pinnedSnapFill ) {
            stageHeight = y;
            stageWidth = STAGE_ASPECT_RATIO * y;
        }

        stageHeight = Math.min( stageHeight, y );
        stageWidth = Math.min( stageWidth, x );

        Stage.height = Debug.canvas.height = canvas.height = stageHeight;
        Stage.width = Debug.canvas.width = canvas.width = stageWidth;

        Stage.el.style.width = '';
        Stage.el.style.marginLeft = '';

        Stage.el.style.height = stageHeight + 'px';
        Stage.el.style.width = stageWidth + 'px';

        Stage.el.style.top = ( y - stageHeight ) / 2 + 'px';
        Stage.el.style.left = ( x - stageWidth ) / 2 + 'px';

        if ( Stage.portrait ) {
            Stage.el.style.top = Stage.width + 'px';
            if ( !pinned ) {
                Stage.el.style.left = ( y - Stage.height ) / 2 + 'px';
            }
        }

        classList.toggle( 'pinned', pinned );
        classList.remove( 'unsized' );

        // durRect = duration.getBoundingClientRect();
        // posRect = position.getBoundingClientRect();

        var box = Stage.el.getBoundingClientRect();

        Stage.top = box.top;
        Stage.left = box.left;
        Stage.right = box.right;
        Stage.bottom = box.bottom;

        resizePromise.resolve();

        Loop.force();

    }

    function timeString( time ) {
        var mod = Math.floor( time % Time.minutes( 1 ) );
        if ( mod < 1 ) mod = '00'
        else if ( mod < 10 ) mod = '0' + mod;
        return Math.floor( time / Time.minutes( 1 ) ) + ':' + mod
    }

} )( this );
;( function( scope ) {

    scope.Time = Singleton( {
        
        seconds: _.identity,
        sec: _.identity,

        minutes: function( minutes ) {
            return minutes * 60;
        },

        millis: function( millis ) {
            return millis / 1000;
        },

        frames: function( frames ) {
            return frames / 60;
        },

        beats: function( beats ) {
            return beats * this.minutes( 1 ) / Project.bpm;
        },

        bars: function( bars ) {
            return bars * this.beats( Project.bar );
        },

        div: function( div ) {
            return div * this.beats( 1 / Project.bar );
        },

        ticks: function( ticks ) {
            return ticks * this.div( 1 / 240 );
        },

        bbd: function( bars, beats, div, ticks ) {
            return this.bars( bars ) + this.beats( beats || 0 ) + this.div( div || 0 ) + this.ticks( ticks || 0 )
        }

    } );

    var to = {};
    
    _.keys( Time ).forEach( function( conversion ) { 
        
        to[ conversion ] = function( v ) {
            return 1 / Time[ conversion ]( 1 / v );  
        };

        Object.defineProperty( Number.prototype, conversion, {
            get: function() {
                return Time[ conversion ]( this );
            }
        } );

    }, this );

    Time.to = to;

} )( this );
;( function( scope ) {

    scope.Timeline = Composition( 

        TimelineLite,

        function() {

            this.timeScale( Time.seconds( 1 ) );

        },

        {

            /*

            // call
            timeline.$( time, function, context, param1, param2.. )

            // add
            timeline.$( time, timeline );
            timeline.$( time, tween );

            // set
            timeline.$( time, target, toObj );
            timeline.$( time, target, prop, toVal );

            // to
            timeline.$( time, duration, target, toObj, easing );
            timeline.$( time, duration, target, prop, toVal, easing );

            // fromTo
            timeline.$( time, duration, target, fromObj, toObj, easing );
            timeline.$( time, duration, target, prop, fromVal, toVal, easing ); 

            ------------------------------- */

            '$': function( $1, $2, $3, $4, $5, $6, $7 ) {
                                
                var args = _.toArray( arguments );

                $1 = Math.max( 0, $1 );

                // set
                if ( _.isObject( $3 ) && !_.isFunction( $2 ) && args.length == 3 ) {
                    return this.set( $2, $3, $1 );
                }

                // set
                if ( _.isString( $3 ) ) { 
                    var obj = {};
                    obj[ $3 ] = $4;
                    return this.set( $2, obj, $1 );   
                }

                // call
                if ( _.isFunction( $2 ) ) {
                    return this.call( $2, args.slice( 3 ), $3, $1 );
                }

                // nest
                if ( $2.instanceof && $2.instanceof( Timeline ) || $2 instanceof TimelineLite || $2 instanceof TweenLite ) {
                    return this.add( $2, $1 );
                }

                // tweens
                if ( _.isNumber( $2 ) ) {

                    // to

                    if ( _.isObject( $4 ) && ( _.isFunction( $5 ) || $5 === undefined ) ) {
                        $4.ease = $4.ease || $5 || Linear.easeNone;
                        return this.to( $3, $2, $4, $1 );
                    }

                    if ( _.isString( $4 ) && _.isNumber( $5 ) && !_.isNumber( $6 ) ) {
                        var obj = { ease: $6 || Linear.easeNone };
                        obj[ $4 ] = $5;
                        return this.to( $3, $2, obj, $1 );
                    }

                    // fromTo

                    if ( _.isObject( $4 ) && _.isObject( $5 ) ) {
                        $5.ease = $5.ease || $6 || Linear.easeNone;
                        $5.immediateRender = $5.immediateRender || false;
                        return this.fromTo( $3, $2, $4, $5, $1 );
                    }

                    if ( _.isString( $4 ) && _.isNumber( $5 ) && _.isNumber( $6 ) ) {
                        $6.ease = $6.ease || $7 || Linear.easeNone;
                        $6.immediateRender = $6.immediateRender || false;
                        return this.fromTo( $3, $2, $4, $5, $1 );
                    }


                }

            } 

        }

    );

} )( this );
function Volume( args, sampleRate ) {

    if ( _.isArray( args ) ) {
        args = { frames: window.UInt8Array ? new UInt8Array( args ) : args };
    }

    this.frames = args.frames;
    this.sampleRate = sampleRate || 60;
    this.max = _.max( frames );
    this.peaks = [];

    this.smoothing = args.smoothing || 0;
    this.gate = args.gate || 0.02;
    this.thresh = args.thresh || 0.8;
    this.decay = args.decay || 4;


    this.frames.forEach( function( v, f ) {

        this.frames[ f ] = v / 0x4000;

    }, this );
    

    var decay = 0;
    var prevPeak = 0;

    this.frames.forEach( function( v, f ) {
        
        var smooth = this._at( f, this.smoothing )

        if ( v > this.gate && v * this.thresh > smooth ) {
            if ( v > prevPeak && decay > 0 ) {
                this.peaks.pop();
            }
            this.peaks.push( Time.frames( f ) );
            decay = this.decay;
        }
        

        if ( decay > 0 ) {
            decay--;
            return;
        }

        
        
    }, this )

}

Volume.forPeaks = function( tracks, start, end, iterator, context ) {
    
    tracks = tracks || _.keys( Volumes );

    var trackEvents = {};
    var total = 0;
    
    tracks.forEach( function( track ) { 

        var peaks = Volumes[ track ].peaksBetween( start, end );
        trackEvents[ track ] = peaks;
        total += peaks.length;

    }, this );

    if ( iterator ) {

        var globalNoteIndex = 0;
        var trackIndex = 0;

        _.each( trackEvents, function( peaks, track ) {
            
            var trackNoteIndex = 0;

            console.log( track, peaks.length );

            peaks.forEach( function( time ) {
                iterator.call( context, time - start, 

                // this guy is all bad.
                {
                    track: track,
                    trackIndex: trackIndex,
                    absoluteTime: time,
                    relativeTime: time - start,
                    noteIndex: globalNoteIndex++,
                    total: total,
                    trackNoteIndex: trackNoteIndex++,
                    trackTotal: peaks.length
                } 


                );
            } );    
            
            trackIndex++;

        } )        
        
    }

    return trackEvents;

};

Volume.prototype.peaksBetween = function( start, end ) {
    if ( end === undefined ) {
        end = Infinity;
    }
    if ( start === undefined ) {
        start = 0;
    }
    var peaks = [];
    this.peaks.forEach( function( time ) { 
        if ( time >= start && time <= end ) {
            peaks.push( time );
        }
    }.bind( this ) );
    return peaks;
}


Volume.prototype.at = function( millis, smoothing ) {

    if ( millis == undefined ) {
        millis = Player.now;
    }
    var frame = this.samples( millis );
    return this._at( frame, smoothing ); 
    
};

Volume.prototype.millis = function( samples ) {
    return samples / this.sampleRate * 1000;
};

Volume.prototype.samples = function( time ) {

    return ~~( time * this.sampleRate );
    
};

Volume.prototype._at = function( frame, smoothing ) {

    smoothing = smoothing || 1;

    var vols = this.frames.slice( Math.max( 0, frame - smoothing ), frame );

    var avg = _.reduce( vols, function( memo, num ) {
        return memo + num;
    }, 0 );

    return avg / vols.length;

};


;( function( scope ) {


    var THETA_RANGE = TWO_PI;
    var PHI_RANGE = PI;

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;

    var firstPerson = new THREE.Quaternion();
    var firstPersonEuler = new THREE.Euler();

    var quat = new THREE.Quaternion();

    var orientation;

    ;( function( scope ) {
        

        var deviceOrientation = {};
        var screenOrientation = 0;

        var radians = Math.PI / 180;
        var zee = new THREE.Vector3( 0, 0, 1 );
        var euler = new THREE.Euler();
        var q0 = new THREE.Quaternion();
        var q1 = new THREE.Quaternion(); // - PI/2 around the x-axis
        var q2 = new THREE.Quaternion(); // - PI/2 around the x-axis
        q1.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), -PI / 2 );
        q2.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), -PI / 2 );

        window.addEventListener( 'deviceorientation', onDeviceOrientation, false );
        window.addEventListener( 'orientationchange', onOrientationChange, false );
        // onOrientationChange();

        function onOrientationChange() {
            var orient = window.orientation ? window.orientation * radians : 0; // O
            orientation = orient;
            q0.setFromAxisAngle( zee, - orient )
        }

        function onDeviceOrientation( event ) {
            
            var alpha  = event.gamma ? event.alpha * radians: 0; // Z
            var beta   = event.beta  ? event.beta  * radians: 0; // X'
            var gamma  = event.gamma ? event.gamma * radians: 0; // Y''

            euler.set( gamma, beta, -alpha, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

            firstPerson.setFromEuler( euler ); // orient the device
            firstPerson.multiply( q1 ); // camera looks out the back of the device, not the top
            // firstPerson.multiply( q2 );
            firstPerson.multiply( q0 ); // adjust for screen orientation
            firstPersonEuler.setFromQuaternion( firstPerson );

        }

    } )( this );

    scope.Controls = new ( Composition(

        Behavior,

        function( object, element ) {

            this.object = object;

            this.mode = HANDHELD && ACCELEROMETER ? TILT : MOUSE;

            this.moveSpeed = 1;
            this.panSpeed = 10;
            this.rotateSpeed = 5;
            this.rollSpeed = 0.0025;
            this.fovSpeed = 0.05;

            this.offsetEasing = 1;
            this.speedMultiplier = 1;

            this.thetaRange = THETA_RANGE;
            this.phiRange = PHI_RANGE;

            this.phiOffset = 0;

            this.mouseIdle = false;
            this.mouseIdleTimeout = null;
            this.mouseIdleTimeoutLength = 8000;

            // "local"

            this.rollDirection = 0;
            this.localDirection = new THREE.Vector3();
            this.parentDirection = new THREE.Vector3();

            this.targetOffset = new THREE.Quaternion();
            this.targetOffsetAlign = new THREE.Quaternion();

            this.debugObject = makeDebugObject();

            this.firstRun = true;

            // listeners

            this.preventDefault = function( e ) { e.preventDefault() };
            this.updateUrl = _.throttle( this.updateUrl.bind( this ), 100, { leading: false, trailing: true } );
            _.bindAll( this, 'onDrag', 'onMouseWheel', 'onMouseMove', 'onMouseIdle', 'onKeyUp', 'onKeyDown', 'onAccelerometerChange' );

            // getters / setters

            function debug() {
                if ( this.mode === DEBUG ) {
                    this.updateDebugMesh();
                    this.updateUrl();
                }
            }


            Object.defineProperties( this, { 
                theta: {
                    get: function() {
                        return this.object.rotation.y;
                    }, 
                    set: function( v ) {
                        this.move( 0, 0, -this.distance );
                        this.object.rotation.y = clamp( v, -THETA_RANGE / 2, THETA_RANGE / 2 );
                        this.move( 0, 0, this.distance );
                        debug();
                    } 
                },
                phi: {
                    get: function() {
                        return this.object.rotation.x;
                    },
                    set: function( v ) {
                        this.move( 0, 0, -this.distance );
                        this.object.rotation.x = clamp( v, -PHI_RANGE / 2, PHI_RANGE / 2 );
                        this.move( 0, 0, this.distance );
                        debug();
                    }
                },
                roll: {
                    get: function() {
                        return this.object.rotation.z
                    },
                    set: function( v ) {
                        this.object.rotation.z = v;
                        this.updateDebugMesh();
                        this.updateUrl();
                    } 
                },
                distance: {
                    get: function() {
                        return this.object._targetDistance;
                    },
                    set: function( v ) {
                        if (v < 0 ) return;
                        this.move( 0, 0, v - this.object._targetDistance );
                        this.updateDebugMesh();
                        this.object._targetDistance = v;
                        this.updateUrl();
                    }
                },
                thetaRange: {
                    get: function() {
                        return this.object.thetaRange;
                    }
                },
                phiRange: {
                    get: function() {
                        return this.object.phiRange;
                    } 
                }

            } )

        },

        {
            update: function() {
                
                this.object.passenger.rotation.reorder( 'YXZ' );

                var offsetEasing;

                if ( this.mode === MOUSE ) { 
                    if ( !this.mouseIdle ) {
                        this.updateMouseOffset();
                        offsetEasing = this.offsetEasing;
                    } else { 
                        offsetEasing = 0.01;
                    }
                } else if ( !FREEZE_ACCELEROMETER ) {
                    var offset = -HALF_PI / 2;
                    if ( window.orientation === 90 ) { 
                        offset *= -1;
                    }
                    var g = cnormalize( Accelerometer.gamma + offset, -HALF_PI / 2, HALF_PI / 2 ) * 0.5 + 0.25;
                    var b = cnormalize( Accelerometer.beta, HALF_PI / 2, -HALF_PI / 2 );

                    this.setTargetOffset( b, g );
                    offsetEasing = this.firstRun ? 1 : this.offsetEasing;
                }


                this.move( 0, 0, -this.distance, true );
                this.object.passenger.quaternion.slerp( this.targetOffset, offsetEasing );
                this.move( 0, 0, this.distance, true );

                this.firstRun = false;
                
                if ( this.mode === DEBUG ) {

                    v.copy( this.localDirection );
                    v.multiplyScalar( this.moveSpeed * this.speedMultiplier );
                    this.move( v.x, v.y, v.z );

                    v.copy( this.parentDirection );
                    v.multiplyScalar( this.moveSpeed * this.speedMultiplier );
                    this.object.position.add( v );

                    if ( this.fovDirection ) {
                        this.object.fov += this.fovDirection * this.fovSpeed * this.speedMultiplier;
                        this.updateUrl();
                    }

                    if ( this.rollDirection ) {
                        this.roll += this.rollDirection * this.rollSpeed * this.speedMultiplier;
                    }

                    if ( this.localDirection.lengthSq() || this.fovDirection || this.parentDirection.lengthSq() ) {
                        this.updateUrl();
                    }

                }

            },
            move: function( x, y, z, offset ) {
                v.set( x, y, z );
                v.applyEuler( ( offset ? this.object.passenger : this.object ).rotation );
                this.object.position.add( v );
            },
            setTargetOffset: function( nx, ny ) {


                var theta = lerp( -this.thetaRange / 2, this.thetaRange / 2, nx );
                var phi = lerp( -this.phiRange / 2, this.phiRange / 2, ny );


                var invert = Stage.screenRotation === HALF_PI;


                var s = window.orientation === 90 ? -1 : 1;

                q.copy( this.object.quaternion ).conjugate();
                v.set( 0, 1, 0 );
                v.applyQuaternion( q );

                m1.identity();
                m1.multiply( m2.makeRotationAxis( v, s * theta ) );
                m1.multiply( m2.makeRotationX( s * phi )  );

                this.targetOffset.setFromRotationMatrix( m1 );

            },
            centerOffset: function() {
                mouseX = window.innerWidth / 2;
                mouseY = window.innerHeight / 2;
            }, 
            onMouseIdle: function() {
                // document.body.style.cursor = 'none';
                if ( this.mouseIdle ) return;
                this.mouseIdle = true;
                this.centerOffset();
                this.updateMouseOffset();
                // document.body.classList.add( 'cursor-none' );
            }, 
            updateMouseOffset: function() {
               var nx = cnormalize( mouseX, Stage.right, Stage.left ) * 0.5 + 0.25;
               var ny = cnormalize( mouseY, Stage.bottom, Stage.top ) * 0.5 + 0.25;
               this.setTargetOffset( nx, ny ); 
            }, 
            centerOffsetInstant: function() {
                this.targetOffset.set( 0, 0, 0, 1 );
                this.object.passenger.quaternion.copy( this.targetOffset );
                this.object.quaternion.copy( this.targetOffset );
            }, 
            onAccelerometerChange: function() {

                // var g = cnormalize( firstPersonEuler.x, 0, PI );
                // var b = cnormalize( firstPersonEuler.z, 0, PI );
                // console.log( firstPersonEuler.x, x, g );
                // console.log( firstPersonEuler.y, b );
                // this.setTargetOffset( b, g );
                // this.targetOffset.setFromEuler( firstPersonEuler );

            },
            onMouseMove: function( e ) {
                if ( this.mouseIdle ) {
                    // document.body.classList.remove( 'cursor-none' );
                    // console.trace( 'mousemove' );
                }
                clearTimeout( this.mouseIdleTimeout );
                this.mouseIdleTimeout = setTimeout( this.onMouseIdle, this.mouseIdleTimeoutLength );
                this.mouseIdle = false;
                this.mouse( e.clientX, e.clientY );
            },
            mouse: function( _mx, _my ) {
                mouseX = _mx;
                mouseY = _my;
                this.offsetEasing = MOUSE_EASING;
            }, 
            easeCircularOutIn: function( x ) {
                var k = 2 * clamp( x, 0, 1 ) - 1, k2 = k * k;
                if ( x < 0.5 ) {
                    return 0.5 * Math.sqrt( 1 - k2 );
                }
                return -0.5 * Math.sqrt( 1 - k2 ) + 1;
            }, 
            onMouseWheel: function( e ) {
                this.distance -= e.wheelDelta * 0.03 * this.speedMultiplier;
                _.defer( this.updateDebugMesh.bind( this ) );
            },
            onMouseOut: function( e ) {
                e = e ? e : window.event;
                var from = e.relatedTarget || e.toElement;
                if (!from || from.nodeName == "HTML") {
                    this.offsetEasing = 0.01;
                    this.centerOffset();
                    // stop your drag event here
                    // for now we can just use an alert
                }

            },
            onDrag: function( e ) {

                if ( e.srcEvent.button == 0 ) {
                    this.theta -= 2 * Math.PI * e.velocityX / this.element.offsetWidth * this.rotateSpeed;
                    this.phi -= 2 * Math.PI * e.velocityY / this.element.offsetHeight * this.rotateSpeed;
                } else if ( e.srcEvent.button == 2 ) {
                    this.move( e.velocityX * this.panSpeed * this.speedMultiplier, -e.velocityY * this.panSpeed * this.speedMultiplier, 0 );
                } else if ( e.srcEvent.button == 3 ) {
                    this.move( e.velocityX * this.panSpeed * this.speedMultiplier, 0, -e.velocityY * this.panSpeed * this.speedMultiplier );
                }

            },
            onKeyDown: function ( e ) {
                switch ( e.keyCode ) {
                    /* d */ case 68: return this.localDirection.x = 1;
                    /* a */ case 65: return this.localDirection.x = -1;
                    /* s */ case 83: return this.localDirection.z = 1;
                    /* w */ case 87: return this.localDirection.z = -1;
                    /* 2 */ case 50: return this.parentDirection.y = 1;
                    /* x */ case 88: return this.parentDirection.y = -1;
                    /* q */ case 81: return this.rollDirection = 1;
                    /* e */ case 69: return this.rollDirection = -1;
                    /* r */ case 82: return this.roll = 0;
                    /* z */ case 90: return this.distance = 0;
                    /* ] */ case 219: return this.fovDirection = -1;
                    /* \ */ case 220: return this.object.fov = 60;
                    /* [ */ case 221: return this.fovDirection = 1;
                    /* â‡§ */ case 16: return this.speedMultiplier = 10;
                }
            },
            onKeyUp: function( e ) {
                switch ( e.keyCode ) { 
                    /* a d */ case 68: case 65: return this.localDirection.x = 0;  
                    /* s w */ case 83: case 87: return this.localDirection.z = 0; 
                    /* 2 x */ case 50: case 88: return this.parentDirection.y = 0;
                    /* q e */ case 81: case 69: return this.rollDirection = 0;
                    /* [ ] */ case 219: case 221: return this.fovDirection = 0;
                    /*  â‡§  */ case 16: return this.speedMultiplier = 1;
                }
            },
            bindDebug: function() {
                
                this.originalOrder = this.object.rotation.order;
                this.object.rotation.reorder( 'ZYX' );

                this.object.add( this.debugObject );
                this.updateDebugMesh();

                window.addEventListener( 'keydown', this.onKeyDown, false );
                window.addEventListener( 'keyup', this.onKeyUp, false ); 
                window.addEventListener( 'mousewheel', this.onMouseWheel, false );
                this.element.addEventListener( 'contextmenu', this.preventDefault, false ); 
                
                this.$element = new Hammer( this.element );
                this.$element.on( 'pan', this.onDrag );

                if ( url.c ) {
                    this.object.unserialize( _.map( url.c.split( ',' ), parseFloat ) );
                }

            },
            unbindDebug: function() {
                
                this.object.remove( this.debugObject );
                this.object.rotation.reorder( this.originalOrder );

                window.removeEventListener( 'keydown', this.onKeyDown, false );
                window.removeEventListener( 'keyup', this.onKeyUp, false ); 
                window.removeEventListener( 'mousewheel', this.onMouseWheel, false ); 
                this.element.removeEventListener( 'contextmenu', this.preventDefault, false ); 

                this.$element.off( 'pan', this.onDrag );

                if ( URL_SAVE_CAMERA ) {
                    history.replaceState( {}, '', url.removeProp( 'c' ) );
                }

            },
            start: function() {
                
                this.firstRun = true;
                
                switch ( this.mode ) {
                    case DEBUG: return this.bindDebug();
                    case MOUSE: return this.bindMouse();
                    case TILT: return this.bindTilt();
                }

            },
            stop: function() {

                switch ( this.mode ) {
                    case DEBUG: return this.unbindDebug();
                    case MOUSE: return this.unbindMouse();
                    case TILT: return this.unbindTilt();
                }
            },
            reset: function() {
               
               this.move( 0, 0, -this.distance, true );
               this.object.passenger.quaternion.copy( new THREE.Quaternion() );
               this.move( 0, 0, this.distance, true );
            }, 
            setMode: function( mode ) {
                
                var active = this.active;
                
                if ( active ) this.stop();
                
                this.mode = mode;
                
                if ( active ) this.start();

            },
            bindMouse: function() {
                window.addEventListener( 'mousemove', this.onMouseMove, false );
                document.addEventListener( 'mouseout', this.onMouseOut, false );
                this.offsetEasing = MOUSE_EASING;
                this.phiOffset = 0;
            },
            unbindMouse: function() {
                this.element.removeEventListener( 'mousemove', this.onMouseMove, false );
            },
            bindTilt: function() {
                Accelerometer.on( 'change', this.onAccelerometerChange );
                this.offsetEasing = TILT_EASING;
                this.phiOffset = 0; 
            },
            unbindTilt: function() {
                Accelerometer.off( 'change', this.onAccelerometerChange );
            },
            updateDebugMesh: function() {
                this.debugObject.position.z = -this.distance;
                this.debugObject.quaternion.copy( this.object.quaternion ).inverse();
            },
            updateUrl: function() {
                if ( URL_SAVE_CAMERA ) {
                    history.replaceState( {}, '', url.prop( 'c', this.object.serialize() ) );    
                }
            }
        } 
    ) )();

    var m1 = new THREE.Matrix4();
    var m2 = new THREE.Matrix4();
    var q = new THREE.Quaternion();
    var v = new THREE.Vector3();
    var z = new THREE.Vector3( 0, 0, 1 );
    var euler = new THREE.Euler();

    var up = new THREE.Vector3(0, 1, 0);
    var v0 = new THREE.Vector3(0, 0, 0);

    function makeDebugObject() {

        var debugObject = new THREE.Object3D();

        var centerGeom = new THREE.BoxGeometry( 10, 10, 10 );
        var centerMat = new THREE.MeshNormalMaterial( { transparent: true, opacity: 0.5 } );
        var center = new THREE.Mesh( centerGeom, centerMat );

        var axisHelper = new THREE.AxisHelper( 100 );
        debugObject.add( axisHelper );

        debugObject.add( center );

        return debugObject 

    } 


} )( this );
var Euler = Composition( 
    THREE.Euler,
    {
        randomize: function() {
            this.x = random.angle();
            this.y = random.angle();
            this.z = random.angle();
            return this;
        }
    } 
);

Euler.temp = new THREE.Euler();
;( function( scope ) {

    var position = new THREE.Vector3();
    var rotation = new THREE.Euler();
    var quaternion = new THREE.Quaternion();
    var scale = new THREE.Vector3( 1, 1, 1 );
    
    var Group = Composition( 
        THREE.Object3D,
        {
            reset: function() {
                
                this.visible = true;

                this.matrixAutoUpdate = true;
                this.matrixWorldNeedsUpdate = false;
                
                this.castShadow = false;
                this.receiveShadow = false;
                this.frustumCulled = true;
                
                this.position.copy( position );
                this.rotation.copy( rotation );
                
                this.quaternion.copy( quaternion );
                
                this.scale.copy( scale );

                this.up.copy( THREE.Object3D.DefaultUp );

                if ( this.parent ) {
                    this.parent.remove( this );
                }

            },
            toWorld: function() {
            
                Scene.updateMatrixWorld();
                if ( this.parent ) {
                    this.parent.updateMatrixWorld();
                }
                this.updateMatrixWorld();

                this.position.copy( this.getWorldPosition() );
                this.quaternion.copy( this.getWorldQuaternion() );
                this.scale.copy( this.getWorldScale() );
                if ( this.parent ) {
                    this.parent.remove( this );
                    Scene.add( this );
                }
                
            } 
        }
    );

    var Child = Composition( Group );

    scope.Group = Group;
    scope.Child = Child;

} )( this );
var Quaternion = Composition( 
    THREE.Quaternion
);

Quaternion.temp = new THREE.Quaternion();
;( function( scope ) {

    var renderer, camera;
    var recording = false;
    scope.Three = Singleton(
        
        Behavior,

        {

            recordTime: 0, 

            start: function( options ) {

                                

                scope.Renderer = new THREE.WebGLRenderer( _.extend( options || {}, { 
                    canvas: Stage.canvas, 
                    antialias: ANTIALIAS, 

                } ) );
                scope.Renderer.setPixelRatio( PIXEL_RATIO );
                scope.Scene = new THREE.Scene();

                // Make sure the camera's full ancestry is added to the scene graph
                // Associate the new camera with the controls
                
                Object.defineProperty( scope.Scene, 'camera', { 

                    get: function() {
                        return camera;
                    },

                    set: function( _camera ) {

                        var wasCamera = !!camera;

                        if ( camera ) {
                            Scene.remove( camera );
                            // _camera.passenger.rotation.set( 0, 0, 0 );
                            // _camera.passenger.quaternion.copy( camera.passenger.quaternion )
                        }

                        var parent = _camera;

                        while ( parent.parent && parent.parent !== Scene ) {
                            parent = parent.parent;
                        }

                        Scene.add( parent );

                        camera = _camera;
                        camera.updateProjectionMatrix();
                        camera.passenger.updateProjectionMatrix();

                        // if ( scope.Controls && Controls.active ) {
                        // if (Controls.object ) {
                            // Controls.stop();
                            // Controls.reset();
                        // }
                        
                        Controls.firstRun = true;
                        Controls.object = _camera;
                        Controls.element = Stage.canvas;

                        if ( Player.now > 0 ) Controls.update();

                        // if ( !HANDHELD ) {
                        // Controls.centerOffsetInstant();

                        // } else { 
                        //     var t = Controls.offsetEasing;
                        //     Controls.offsetEasing = 1;
                        //     clearTimeout( iAmABadProgrammer );
                        //     iAmABadProgrammer = setTimeout( function() {
                        //         Controls.offsetEasing = t;
                        //     }, 0 );
                        // }
                        // hack

                        // Pair.fogUniforms.far.value = _camera.far;

                    } 

                } );

                renderer = Renderer;

                Scene.camera = new Camera();
                Stage.on( 'resize', this.resize, this );

                // this.setEffect( Three.STEREO );

            },

            setEffect: function( type ) {
                renderer = type ? new THREE[ type + 'Effect' ]( Renderer ) : Renderer;
                this.resize();
                this.update();
            }, 

            record: function() {
               recording = true;
               rendercan.record( renderer.domElement ); 
            }, 
            stop: function() {
               recording = false;
               rendercan.stop(); 
            }, 

            update: function() {
                renderer.render( Scene, Scene.camera.passenger );
                if ( RECORD_MODE && recording ) { 
                    // rendercan.grab();
                    Three.recordTime += 1/30;
                    // console.log( Three.recordTime );
                }
            },

            resize: function() {
                Scene.camera.updateProjectionMatrix();
                renderer.setSize( Stage.width, Stage.height );
                renderer.setPixelRatio( PIXEL_RATIO );
                Loop.force();
            },

        } );

} )( this );
var Vector = Composition( 
    THREE.Vector3,
    {
        set: function( x ) {
            if ( !arguments.length ) {
                this.x = x;
                this.y = y;
                this.z = z;
            }
            return this;
        },
        randomize: function( len ) {
            this.x = random.range( 1 );
            this.y = random.range( 1 );
            this.z = random.range( 1 );
            this.normalize();
            this.setLength( len );
            return this;
        }
    } 
);

Vector.temp = new Vector();
;( function( scope ) {
    
    Bootstrap.on( 'init', init );
    Bootstrap.on( 'done', done );

    scope.Accelerometer = Singleton( 
    
        Events,
        
        {

            orientation: 0,

            gamma: 0,
            beta: 0,
            alpha: 0,

            on: function( e, fnc, ctx ) { 
                e === 'change' && changePromise.then( fnc );
            }

        }

    );

    var changePromise = new Promise();

    function init() {
        window.addEventListener( 'orientationchange', triggerChange, false );
        window.addEventListener( 'deviceorientation', triggerChange, false );
        Accelerometer.on( 'change', onChange );
    } 

    function done() {
        triggerChange();
    } 
    
    function onChange( e ) {
        if ( e ) {
            Accelerometer.alpha = ( e.alpha || 0 ).deg;
            Accelerometer.gamma = ( e.gamma || 0 ).deg;
            Accelerometer.beta = ( e.beta || 0 ).deg;
        }
        Accelerometer.orientation = getOrientation();


        changePromise.resolve();
    }

    function triggerChange( e ) {
        Accelerometer.trigger( 'change', e );
    }

    function getOrientation() {

        if ( _.isNumber( window.orientation ) ) {
            return window.orientation.deg;
        }

        var orientation;

        if ( _.isString( screen.orientation ) ) {
            orientation = screen.orientation;
        } else if ( screen.orientation ) {
            orientation = screen.orientation.type;
        } else if ( screen.mozOrientation ) {
            orientation = screen.mozOrientation;
        } else { 
            return 0;
        }

        switch ( orientation ) {
            case 'landscape-primary':
                return 90.0.deg;
            case 'landscape-secondary':
                return -90.0.deg;
            case 'portrait-secondary':
                return 180.0.deg;
            case 'portrait-primary':
                return 0;
        }

    }


} )( this );
Array.prototype.remove = function( i ) {
    this.splice( i, 1 );  
};

Array.prototype.clear = function() {
    while ( this.length > 0 ) {
        this.pop();
    }  
};
function Singleton() {

    return compose( _.toArray( arguments ), {}, true );

};

function Composition() {

    var args = _.toArray( arguments );

    // The last object is assumed to be a prototype if not a function
    // If no prototype is provided it is assumed to be blank
    var proto = _.isFunction( args[ args.length - 1 ] ) ? {} : args.pop();

    return compose( args, proto, false );

};

function compose( mixins, proto, singleton ) {

    for ( var i in mixins ) {
        var m = mixins[ i ];
        if ( !(_.isFunction( m ) || _.isObject( m ) ) ) {
            throw new Error( 'Invalid mixin argument: ' + m );
        }
    }

    _mixins = mixins.slice( 0 );
    mixins  = mixins.reverse();

    // When mixing classes into a singleton, use the prototype methods as "static" methods.
    if ( singleton ) {
        mixins.forEach( function( m, i ) {
            if ( _.isFunction( m ) ) { 
                mixins[ i ] = m.prototype;
            }
        } );
    }

    var constructors = []; // Functions to call in Class's constructor
    var methods      = {}; // Functions to attach to Class's prototype.
    var statics      = {}; // Functions to attach to Class's namespace.

    // Initialize list of prototype methods with proto option
    for ( var key in proto ) {
        methods[ key ] = methods[ key ] || [];
        methods[ key ].push( proto[ key ] );
    }


    for ( var i = 0, l = mixins.length; i < l; i++ ) {

        var mixin = mixins[ i ];

        // If the mixin is a function, add its prototype methods to Class
        if ( _.isFunction( mixin ) ) {

            for ( var key in mixin.prototype ) {

                // We'll deal with the constructor later
                if ( key == 'constructor' ) {
                    continue;
                }
                
                try { 
                    // catch any potential errors in a getter ( three.js ... )
                    mixin.prototype[ key ];
                } catch ( e ) {
                    continue;
                }

                var prop = mixin.prototype[ key ];

                // We only want functions in the prototype. Nothing else can really be "mixed"
                if ( _.isFunction( prop ) ) {
                    methods[ key ] = methods[ key ] || [];
                    methods[ key ].unshift( prop );       
                }
            }

            // Call the mixin as a constructor
            constructors.unshift( mixin );

        } 

        // Copy every property "forward" in the mixin list.
        for ( var key in mixin ) {

            if ( !mixin.hasOwnProperty( key ) ) {
                continue;
            }

            if ( _.isFunction( mixin[ key ] ) ) {

                if ( key == 'constructor' ) {
                    continue;
                }

                // Static methods get merged just like prototype methods ...
                if ( statics[ key ] === undefined ) {
                    statics[ key ] = [];
                    statics[ key ].__methodList = true; // It could have been a static array ...
                }

                statics[ key ].push( mixin[ key ] );
                
            } else { 
            
                // Static properties just get passed forward
                statics[ key ] = mixin[ key ];

            }

        }

    }

    // Define a method in Class's prototype for every method mentioned in a prototype from the mixins list.
    _.each( methods, function( methodList, key ) {
        var target = singleton ? Class : Class.prototype;
        target[ key ] = composition( methodList );
    } );

    // Same goes for statics.
    _.each( statics, function( prop, key ) {
        if ( _.isArray( prop ) && prop.__methodList ) {
            Class[ key ] = composition( prop );
        } else {
            Class[ key ] = prop;
        }
    } );

    var methodNames = _.keys( methods );

    // storing arguments passed to the constructor 
    var $arguments;

    function Class() {
        
        $arguments = arguments;
        constructors.forEach( applyConstructor, this );
        methodNames.forEach( bindMethod, this );

    }

    // new "instanceof" method, checks mixed in ancestors
    Object.defineProperty( singleton ? Class : Class.prototype, 'instanceof', {
        value: function( type ) {
            if ( type === Class ) return true;
            _mixins.forEach( function( m ) {
                return m instanceof type || m === type;
            } )
        }
    } );


    // Should be taken out of this scope once execution order isn't a problem and Composition can be scoped ...

    function bindMethod( method ) { 
        this[ method ] = this[ method ].bind( this );
    }

    function applyConstructor( constructor ) {
        constructor.apply( this, $arguments );
    }
    
    // Returns a function that calls every function in an array of functions.
    function composition( methods ) {

        methods = methods.slice( 0 ).reverse();

        // remove empty functions
        methods = _.filter( methods, getFunctionBody );

        if ( methods.length === 0 ) {
        
            return function() {};
        
        } else if ( methods.length === 1 ) {
        
            return methods[ 0 ];
        
        } else if ( methods.length == 2 ) {
        
            var $0 = methods[ 0 ];
            var $1 = methods[ 1 ];
            return function() {
                this.super = $0.apply( this, arguments );
                return $1.apply( this, arguments );
            }
        
        } else if ( methods.length == 3 ) {
        
            var $0 = methods[ 0 ];
            var $1 = methods[ 1 ];
            var $2 = methods[ 2 ];
            return function() {
                this.super = $0.apply( this, arguments );
                this.super = $1.apply( this, arguments );
                return $2.apply( this, arguments );
            }
            
        }

        var last = methods.pop();
        var len = methods.length;
        var i;

        return function() {
            for ( i = 0; i < len; i++ ) {
                this.super = methods[ i ].apply( this, arguments );
            }
            return last.apply( this, arguments );
        };

    }

     

    function getFunctionBody( fnc ) { 
        var contents = fnc.toString();
        return contents.substring( contents.indexOf( '{' ) + 1, contents.lastIndexOf( '}' ) );
    }

    function getFunctionParams( fnc ) { 
        var contents = fnc.toString();
        var args = contents.substring( contents.indexOf( '(' ) + 1, contents.indexOf( ')' ) );
        if ( !args ) return [];
        return args.split( /\s*,\s*/ );
    }
    

    return Class;

}

var Pool = Composition(

    {
        init: function( callback, progress ) {
            this.position = 0;
            this.items = [];

            var itemsPerFrame = LITE ? 1 : HANDHELD ? 5 : 15;

            var addItem = function() {
                
                if ( this.items.length + itemsPerFrame < this.size ) {
                    requestAnimationFrame( addItem );
                }
                for ( var i = 0; i < itemsPerFrame && this.items.length < this.size; i++ ) { 
                    var item = this.create();
                    item.busy = false;
                    this.items.push( item );
                }
                
                progress( this.items.length / this.size );
                if ( this.items.length >= this.size ) { 
                    callback();
                }

            }.bind( this );

            addItem();

        },

        create: function() {
            return {};   
        },

        next: function( requirements ) {

            if ( !_.isFunction( requirements ) ) {
                requirements = where( requirements );
            }

            var item, i = 0;
            
            do {

                item = this.items[ this.position++ % this.items.length ];  
                i++;

            } while ( item.busy && requirements( item ) && i < this.items.length );
            
            if ( item.busy ) {
                console.warn( 'No available items!' );
            }
            
            item.busy = true;
            return item;

        },

        return: function( item ) {
            item.busy = false;
        } 
        
    }

);
function Promise() {

    var callbacks = [];
    var resolved = false;

    this.resolve = function() {
    
        if ( resolved ) return;
    
        resolved = true;
        callbacks.forEach( function( fnc ) { fnc() } );
    
    };

    this.then = function( fnc ) {
        
        resolved ? fnc() : callbacks.push( fnc );
        return this;

    }.bind( this ); 

}

Promise.all = function( arr ) {
    
    var all = new Promise();
    var resolved = 0;

    var callback = function() {
        resolved++;
        if ( resolved === arr.length ) {
            all.resolve();
        }
    };

    arr.forEach( function( val ) { 
        val.then( callback );
    } );

    return all;

};
function Shuffler( arr ) {
    this.arr = _.shuffle( arr );
    this.index = 0;
    if ( arr.length === 1 ) {
        this.next = function() {
            return arr[ 0 ];  
        };
    }
};

Shuffler.prototype.next = function() {
    if ( this.index < this.arr.length ) {
        this.reset();
    }
    this.cur = this.arr[ this.index ]
    this.index++;
    return this.cur;
};

Shuffler.prototype.reset = function() {
    this.arr = _.shuffle( this.arr );
    if ( this.arr[ 0 ] === this.cur ) {
        this.arr.push( this.arr.shift() );
    }
    this.index = 0;
};
function construct(ctor, params) {
    var obj, newobj;

    // Create the object with the desired prototype
    if (typeof Object.create === "function") {
        // ECMAScript 5 
        obj = Object.create(ctor.prototype);
    }
    else if ({}.__proto__) {
        // Non-standard __proto__, supported by some browsers
        obj = {};
        obj.__proto__ = ctor.prototype;
        if (obj.__proto__ !== ctor.prototype) {
            // Setting it didn't work
            obj = makeObjectWithFakeCtor();
        }
    }
    else {
        // Fallback
        obj = makeObjectWithFakeCtor();
    }

    // Set the object's constructor
    obj.constructor = ctor;

    // Apply the constructor function
    newobj = ctor.apply(obj, params);

    // If a constructor function returns an object, that
    // becomes the return value of `new`, so we handle
    // that here.
    if (typeof newobj === "object") {
        obj = newobj;
    }

    // Done!
    return obj;

    // Subroutine for building objects with specific prototypes
    function makeObjectWithFakeCtor() {
        function fakeCtor() {
        }
        fakeCtor.prototype = ctor.prototype;
        return new fakeCtor();
    }
}
;( function() {
    
    var transforms = {

        translate: function( x, y, z ) {
            return 'translate(' + x + 'px,' + y + 'px, ' + ( z || 0 ) + 'px )';
        },

        scale: function( x, y ) {
            return 'scale( ' + x + ', ' + y + ' )';
        },

        rotate: function( rad ) {
            return 'rotate( ' + rad + 'rad )';
        }

    }

} )();

var css = {

    vendorPrefix: '-webkit-', // todo

    transform: function() {
    
        var el = arguments[ 0 ];

        var args = Array.prototype.split( arguments, 1 );

        var transformStrings = [];
        
        var currentArgs = [];
        var currentTransform;

        args.forEach( function( arg ) {
        
            if ( _.isString( arg ) ) {

                if ( currentTransform ) {
                    apply();
                }

                currentTransform = transforms[ arg ];

            } else {

                currentArgs.push( a );

            }
            
        } );

        if ( currentArgs.length ) {
            apply();
        }

        function apply() {
            transformStrings.push( currentTransform.apply( this, currentArgs ) );
            currentArgs.length = 0;
        } 

        var transformProperty = css.vendorPrefix + 'transform';

        el.style[ transformProperty ] = transformStrings.join( ' ' );

    }

}
function empty( obj ) {

    return !_.keys( obj ).length;

}
//extend to allow right click
//input mouse map is not a public property of Hammer, so copy it here
var MOUSE_INPUT_MAP = {
    mousedown: Hammer.INPUT_START,
    mousemove: Hammer.INPUT_MOVE,
    mouseup: Hammer.INPUT_END
};
//override
Hammer.inherit(Hammer.MouseInput, Hammer.Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        //modified to handle all buttons
        //left=0, middle=1, right=2
        if (eventType & Hammer.INPUT_START) {
            this.pressed = true;
        }

        if (eventType & Hammer.INPUT_MOVE && ev.which === 0) {
            eventType = Hammer.INPUT_END;
        }
        // mouse must be down, and mouse events are allowed (see the TouchMouse input)
        if (!this.pressed || !this.allow) {
            return;
        }

        if (eventType & Hammer.INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
                        button: ev.button,
            pointers: [ev],
            changedPointers: [ev],
            pointerType: 'mouse',
            srcEvent: ev
        });
    }
});

function hammer( id ) {
    return new Hammer( document.getElementById( id ) );
}
function map( v, a, b, c, d ) {
    return c + ( d - c ) * ( v - a ) / ( b - a );

}

function lerp( a, b, t ) {

    return ( b - a ) * t + a;

}

function normalize( v, a, b ) {

    return ( v - a ) / ( b - a );

}

function clamp( v, min, max ) {

    return Math.max( min, Math.min( max, v ) );
    
} 

function cmap( v, a, b, c, d ) {

    return lerp( c, d, cnormalize( v, a, b ) );
    
}

function cnormalize( v, a, b ) {

    return clamp( normalize( v, a, b ), 0, 1 );

}

function clerp( a, b, t ) {

    return clamp( lerp( a, b, t ) );

}

function between( min, max ) {
    
    return function( v ) {
        return min <= v && v < max;
    } 

}


Object.defineProperty( Number.prototype, 'deg', {
    
    get: function() {
        return this / RADIANS;
    }

} );
function noise(x, y, z) {
  if ( noise.profile.generator === undefined ) {
    // caching
    noise.profile.generator = new noise.PerlinNoise(noise.profile.seed);
  }
  var generator = noise.profile.generator;
  var effect = 1,
    k = 1,
    sum = 0;
  for (var i = 0; i < noise.profile.octaves; ++i) {
    effect *= noise.profile.fallout;
    switch (arguments.length) {
    case 1:
      sum += effect * (1 + generator.noise1d(k * x)) / 2;
      break;
    case 2:
      sum += effect * (1 + generator.noise2d(k * x, k * y)) / 2;
      break;
    case 3:
      sum += effect * (1 + generator.noise3d(k * x, k * y, k * z)) / 2;
      break;
    }
    k *= 2;
  }
  return sum;
};


// these are lifted from Processing.js
// processing defaults
noise.profile = {
  generator: undefined,
  octaves: 4,
  fallout: 0.5,
  seed: undefined
};

// Pseudo-random generator
noise.Marsaglia = function(i1, i2) {
  // from http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c
  var z = i1 || 362436069,
    w = i2 || 521288629;
  var nextInt = function () {
    z = (36969 * (z & 65535) + (z >>> 16)) & 0xFFFFFFFF;
    w = (18000 * (w & 65535) + (w >>> 16)) & 0xFFFFFFFF;
    return (((z & 0xFFFF) << 16) | (w & 0xFFFF)) & 0xFFFFFFFF;
  };

  this.nextDouble = function () {
    var i = nextInt() / 4294967296;
    return i < 0 ? 1 + i : i;
  };
  this.nextInt = nextInt;
}

noise.Marsaglia.createRandomized = function () {
  var now = new Date();
  return new noise.Marsaglia((now / 60000) & 0xFFFFFFFF, now & 0xFFFFFFFF);
};

// Noise functions and helpers
noise.PerlinNoise = function( seed ) {
  var random = seed !== undefined ? new noise.Marsaglia(seed) : noise.Marsaglia.createRandomized();
  var i, j;
  // http://www.noisemachine.com/talk1/17b.html
  // http://mrl.nyu.edu/~perlin/noise/
  // generate permutation
  var p = new Array(512);
  for (i = 0; i < 256; ++i) {
    p[i] = i;
  }
  for (i = 0; i < 256; ++i) {
    var t = p[j = random.nextInt() & 0xFF];
    p[j] = p[i];
    p[i] = t;
  }
  // copy to avoid taking mod in p[0];
  for (i = 0; i < 256; ++i) {
    p[i + 256] = p[i];
  }

  function grad3d(i, x, y, z) {
    var h = i & 15; // convert into 12 gradient directions
    var u = h < 8 ? x : y,
      v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  function grad2d(i, x, y) {
    var v = (i & 1) === 0 ? x : y;
    return (i & 2) === 0 ? -v : v;
  }

  function grad1d(i, x) {
    return (i & 1) === 0 ? -x : x;
  }

  function lerp(t, a, b) {
    return a + t * (b - a);
  }

  this.noise3d = function (x, y, z) {
    var X = Math.floor(x) & 255,
      Y = Math.floor(y) & 255,
      Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    var fx = (3 - 2 * x) * x * x,
      fy = (3 - 2 * y) * y * y,
      fz = (3 - 2 * z) * z * z;
    var p0 = p[X] + Y,
      p00 = p[p0] + Z,
      p01 = p[p0 + 1] + Z,
      p1 = p[X + 1] + Y,
      p10 = p[p1] + Z,
      p11 = p[p1 + 1] + Z;
    return lerp(fz,
    lerp(fy, lerp(fx, grad3d(p[p00], x, y, z), grad3d(p[p10], x - 1, y, z)),
    lerp(fx, grad3d(p[p01], x, y - 1, z), grad3d(p[p11], x - 1, y - 1, z))),
    lerp(fy, lerp(fx, grad3d(p[p00 + 1], x, y, z - 1), grad3d(p[p10 + 1], x - 1, y, z - 1)),
    lerp(fx, grad3d(p[p01 + 1], x, y - 1, z - 1), grad3d(p[p11 + 1], x - 1, y - 1, z - 1))));
  };

  this.noise2d = function (x, y) {
    var X = Math.floor(x) & 255,
      Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    var fx = (3 - 2 * x) * x * x,
      fy = (3 - 2 * y) * y * y;
    var p0 = p[X] + Y,
      p1 = p[X + 1] + Y;
    return lerp(fy,
    lerp(fx, grad2d(p[p0], x, y), grad2d(p[p1], x - 1, y)),
    lerp(fx, grad2d(p[p0 + 1], x, y - 1), grad2d(p[p1 + 1], x - 1, y - 1)));
  };

  this.noise1d = function (x) {
    var X = Math.floor(x) & 255;
    x -= Math.floor(x);
    var fx = (3 - 2 * x) * x * x;
    return lerp(fx, grad1d(p[X], x), grad1d(p[X + 1], x - 1));
  };

}

random.generator = Math.random.bind( Math );

function random( $1, $2, $3 ) {

    if ( arguments.length == 1 ) {
        
        if ( _.isArray( $1 ) ) {
            return $1[ ~~( random.generator() * ( $1.length - 1 ) ) ];
        }

        return random.generator() * $1;

    } else if ( arguments.length == 2 ) {

        return random.generator() * ( $2 - $1 ) + $1;

    }

    return random.generator();

};

random.range = function( $1, $2 ) {

    var min = -1, max = 1;

    switch ( arguments.length ) {
        case 1:
            min = -$1;
            max = $1;
            break;
        case 2:
            min = $1;
            max = $2;
            break;
    }

    return random.generator() * ( max - min ) + min;
    
};

random.int = function( $1, $2 ) {

    var min = -1, max = 1;

    switch ( arguments.length ) {
        case 1:
            min = -$1;
            max = $1;
            break;
        case 2:
            min = $1;
            max = $2;
            break;
    }

    return ~~( random.generator() * ( max - min ) + min );
    
};

random.angle = function() {
    return random.generator() * TWO_PI;  
};

random.chance = function( percent ) {
    return random.generator() < ( percent || 0.5 );
};

random.sign = function() {
    return random.generator() < 0.5 ? 1 : -1;
};
// returns a throttled function that will only run until
// at least min millseconds have elapsed since it's creation

// will only run once if invoked multiple times

// useful when you have to wait for an animation to finish

function throttled( fnc, min ) {
    
    var disabled = true, called;

    setTimeout( function() {
        disabled = false;
        if ( called ) {
            fnc.apply( this, called );
        }
    }, min );

    return function() {
        if ( !disabled && !called ) {
            fnc.apply( this, _.toArray( arguments ) );
        } else {
            called = _.toArray( arguments );
        }
    }

}
function where( requirements ) {

    return function( obj ) {
        
        var v = true, t;

        _.each( requirements, function( req, key ) {

            if ( _.isFunction( req ) ) {

                t = req( obj[ key ], obj, key );

            } else {

                t = req === obj[ key ];

            }

            v = v && t;
            
        } );

        return v;

    }

};
function get( url, success, error ) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function( e ) {
        if ( xhr.readyState == 4 ) {
            if ( xhr.status == 200 ) {
                return success( xhr.responseText );
            }
            if ( error ) {
                return error( xhr.status + ' ' + xhr.statusText );
            }
            throw xhr.status + ' ' + xhr.statusText;
        }
    };
    xhr.open( 'GET', url, true );
    xhr.send( null );
}

function getBuffer( url, success, error ) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function( e ) {
        if ( xhr.readyState == 4 ) {
            if ( xhr.status == 200 ) {
                return success( e.currentTarget.response );
            }
            if ( error ) {
                return error( xhr.status + ' ' + xhr.statusText );
            }
            throw xhr.status + ' ' + xhr.statusText;
        }
    };
    xhr.open( 'GET', url, true );
    xhr.responseType = 'arraybuffer';
    xhr.send( null );
}
var PairPool = Singleton( 

    Pool,

    {

        create: function() {
            return new Pair();
        }

    }

);
;( function( scope ) {

    scope.PairShot = Composition(

        Shot,

        function() {
            this.checkedOut = {};
        },

        {
            getPct: function( pct, req ) {
                return this.get( ~~( PairPool.size * pct ), req );
            },
            get: function( count, req ) {
                var pairs = [];
                for ( var i = 0; i < count; i++ ) {
                    pairs.push( this.next( req ) );
                }
                return pairs;
            },
            next: function( req ) {
                var pair = PairPool.next( req );
                this.checkedOut[ pair.id ] = pair;
                pair.reset();
                this.container.add( pair );
                return pair;
            },
            stop: function() {
                for ( var id in this.checkedOut ) {
                    var pair = this.checkedOut[ id ];
                    PairPool.return( pair );
                    pair.reset();
                    delete this.checkedOut[ pair.id ];
                }
            },
            start: function() {
                // floor.reset();
                // bg.reset();
                // Pair.setFogDistance( Pair.DefaultFogDistance );
                // bg.updateMatrix();
                // // floor.visible = false;
                // console.log( 'PairShot Start' );
            },
            update: function() {
                // console.log( _.filter( this.checkedOut, function( p ) {return p.strokeVisible} ).length );
                // _.each( this.checkedOut, function( pair ) {
                //     var dist = pair.position.distanceToSquared( Scene.camera.passenger.position );
                //     if ( dist > Pair.maxStrokeDistanceSquared / Math.pow( Scene.camera.fov * 200, 2 ) ) {
                //         pair.hideStroke();
                //     } else { 
                //         pair.showStroke();
                //     }
                // } );
            } 
        }

    );

} )( this );
var ElasticAppear = Composition( 
    
    Behavior,

    function() {
    
        this.duration = Time.seconds( 0.1 );
        this.amplitude = 1;
        this.period = 1;
        this.p3 = this.period / TWO_PI * ( Math.asin( 1 / this.amplitude ) || 0 );
        this.scale = 1;
    },

    {
        start: function() {
            this.target.visible = true;
        },
        update: function() {
            var t = clamp( this.now / this.duration, 0, 1 ) ;
            var s = this.ease( t ) || 0.000001;
            s *= this.scale;
            this.target.scale.set( s, s, s ) ;
        },
        stop: function() {
            this.target.scale.set( this.scale, this.scale, this.scale );
        },
        ease: function( t ) {
            return this.amplitude * Math.pow( 2, -10 * t ) * Math.sin( ( t - this.p3 ) * TWO_PI / this.period ) + 1;
        } 
    }

)
var PairJiggle = Composition( 
    ElasticAppear, 
    function() {
        this.duration = random( 0.5, 1 );
        this.amplitude = random( 1, 1.5 );
        this.period = random( 0.2 , 0.3 );
    }
);
( function( scope ) {

    scope.Camera = Composition( 
        
        THREE.PerspectiveCamera,

        Behavior,

        function( parent ) {

            if ( !parent ) {

                this.position.set( 0, 0, 300 );

                this.passenger = new Camera( this );
                this.add( this.passenger );

                var props = {
                    fov: 60,
                    near: 1,
                    far: 30000
                };
                
                this._distance = 0;
                this._targetDistance = 0;
                this.distanceEasing = 0.1;

                this.thetaRange = TWO_PI / 3;
                this.phiRange = PI;

                _.keys( props ).forEach( function( k ) { 
                    
                    Object.defineProperty( this, k, {
                        get: function() {
                            return props[ k ];
                        },
                        set: function( v ) {
                            props[ k ] = v;
                            // Pair.fogUniforms.far.value = this.far;
                            this.updateProjectionMatrix();
                            this.passenger.updateProjectionMatrix();
                        }
                    } );

                }, this );

                Object.defineProperty( this, 'distance', {
                    get: function() {
                        return this._targetDistance;
                    },
                    set: function( v ) {
                        this._targetDistance = v;
                    }
                } )


            } else { 

                this.rotation.reorder( 'YXZ' );
                // this.matrixAutoUpdate = false;

                var props = [ 'fov', 'near', 'far', 'distance' ];
                props.forEach( function( k ) { 
                    
                    Object.defineProperty( this, k, {
                        get: function() {
                            return parent[ k ];
                        },
                        set: _.noop
                    } );

                }, this );


            }

            this.viewOffset = { x: 0, y: 0, width: 1, height: 1 }; // todo
            
            Object.defineProperty( this, 'aspect', {
                get: function() {
                    return Stage.width / Stage.height;
                },
                set: _.noop
            } )

            this.updateProjectionMatrix();
            
        },

        {

            update: function() {
                this._distance += ( this._targetDistance - this._distance ) * this.distanceEasing;
            },

            copy: function( $1 ) {

                if ( _.isNumber( $1 ) || _.isArray( $1 ) ) {
                    this.unserialize.apply( this, arguments );
                } else { 
                    this.unserialize( $1.serialize() );
                    // this._distance = $1._targetDistance;
                    // this._targetDistance = $1._targetDistance;
                    // this.distanceEasing = $1.distanceEasing;
                    // this.thetaRange = $1.thetaRange;
                    // this.phiRange = $1.phiRange;
                }

            },

            copyLocal: function( camera ) {

                this.fov = camera.fov;
                this.near = camera.near;
                this.far = camera.far;

                this.position.copy( camera.position );
                this.quaternion.copy( camera.quaternion );

                this.updateProjectionMatrix();
                
            },

            // todo: duplicated in Group.js
            toWorld: function() {
            
                this.position.copy( this.getWorldPosition() );
                this.quaternion.copy( this.getWorldQuaternion() );
                this.scale.copy( this.getWorldScale() );
                if ( this.parent ) {
                    this.parent.remove( this );
                    Scene.add( this );
                }
                
            },

            frustumSlice: function( atDistance ) {

                if ( arguments.length == 0 ) {
                    atDistance = -this.position.z;
                }

                this.updateProjectionMatrix();
                this.passenger.updateProjectionMatrix();
             
                var mapped = ( atDistance - this.near ) / ( this.far - this.near ),
                    result = [];

                for ( var i = 0, n, f; i < 4; i ++ ) {
                    
                    position.set( RECT[ i ][ 0 ], RECT[ i ][ 1 ], -1 );
                    position.unproject( this.passenger );
                    n = position.clone();
             
                    position.set( RECT[ i ][ 0 ], RECT[ i ][ 1 ], 1 );
                    position.unproject( this.passenger );
                    f = position.clone();
             
                    f.sub( n );
                    f.multiplyScalar( mapped );
                    f.add( n );
             
                    result.push( f );
             
                }
             
                return {
                    top: result[ 0 ].y,
                    right: result[ 2 ].x,
                    bottom: result[ 2 ].y,
                    left: result[ 1 ].x,
                    corners: result,
                    width: Math.abs( result[ 2 ].x - result[ 1 ].x ),
                    height: Math.abs( result[ 0 ].y - result[ 2 ].y ),
                };
             
            },

            unserialize: function() {


                var arr = _.toArray( arguments );

                if ( _.isArray( arr[ 0 ] ) ) {
                    arr = arr[ 0 ];
                }
            
                this.position.fromArray( arr.slice( 0, 3 ) );
                // this.rotation.fromArray( arr.slice( 3, 6 ) );
                this.quaternion.fromArray( arr.slice( 6, 10 ) );

                this.fov = arr[ 10 ];
                this.near = arr[ 11 ];
                this.far = arr[ 12 ];
                this.aspect = Stage.width / Stage.height;

                this.updateProjectionMatrix();
                this.updateMatrix();

                this.viewOffset.x = arr[ 13 ];
                this.viewOffset.y = arr[ 14 ];
                this.viewOffset.width = arr[ 15 ];
                this.viewOffset.height = arr[ 16 ];

                // getting real gross here
                if ( Scene.camera === this ) {
                    Scene.camera = this;
                }

                return this;
                
            },

            serialize: function() {
            
                return [ 

                    parseFloat( this.position.x.toFixed( 4 ) ), 
                    parseFloat( this.position.y.toFixed( 4 ) ), 
                    parseFloat( this.position.z.toFixed( 4 ) ), 

                    parseFloat( this.rotation.x.toFixed( 4 ) ), 
                    parseFloat( this.rotation.y.toFixed( 4 ) ), 
                    parseFloat( this.rotation.z.toFixed( 4 ) ), 

                    parseFloat( this.quaternion.x.toFixed( 4 ) ), 
                    parseFloat( this.quaternion.y.toFixed( 4 ) ), 
                    parseFloat( this.quaternion.z.toFixed( 4 ) ), 
                    parseFloat( this.quaternion.w.toFixed( 4 ) ),

                    this.fov,
                    this.near,
                    this.far,
                ];
                
            }

        }

    );

    var position = new THREE.Vector3();
    var quaternion = new THREE.Quaternion();
    var scale = new THREE.Vector3();

    var RECT = [
        [ -1, -1 ],
        [  1, -1 ],
        [ -1,  1 ],
        [  1,  1 ],
    ];

} )( this );
;( function( scope ) {

    scope.CameraTween = Composition( 
        
        Behavior,

        // todo: kill constructor
        function( target, duration, origin, dest, easing ) {

            this.target = target;
            this.duration = duration || 0;
            this.easing = easing || Easing.Linear.None;

            this.origin = origin;
            this.dest = dest;

            this._origin = new Camera();
            this._dest = new Camera();

        },

        {
            start: function() {

                if ( !this.origin )  {
                    this._origin.copy( this.target );
                } else { 
                    interpretArgument( this.origin, this._origin );
                }
                
                interpretArgument( this.dest, this._dest );


                if ( !this._dest ) {
                    throw new Error( 'Missing argument for Camera destination.' );
                }

                this.target.copy( this._origin );

            },
            update: function() {
                var k = clamp( this.easing( this.now / this.duration ), 0, 1 );
                this.target.quaternion.copy( this._origin.quaternion ).slerp( this._dest.quaternion, k );
                this.target.position.copy( this._origin.position ).lerp( this._dest.position, k );
                this.target.fov = lerp( this._origin.fov, this._dest.fov, k );
                this.target.updateProjectionMatrix();
            },
            stop: function() {
                this.target.copy( this._dest );
            } 
        }

    );


    function interpretArgument( target, camera ) {

        if ( target.instanceof && target.instanceof( Camera ) ) {

            camera.copy( target );    

        } else if ( target.instanceof && target.instanceof( Child ) ) { 

            camera.position.copy( target );
            camera.quaternion.copy( target );

        } else if ( _.isArray( target ) ) { 

            camera.unserialize( target );

        } else { 

            console.log( target );
            throw new Error( 'Unrecognized target type.' );

        }
    }   
    
} )( this );
var RECORD_MODE = url.boolean( 'record' );
var TITLE_CAP = url.boolean( 'title' );
var FREEZE_ACCELEROMETER = true;

var IPHONE_5 = GPU && GPU.indexOf( 'Apple A7 GPU' ) !== -1;
var MEDIUM = url.boolean( 'medium', IPHONE_5 );
var LITE = url.boolean( 'lite', !MEDIUM && GPU && GPU.indexOf( 'IMGSGX543' ) !== -1 );

var PIXEL_RATIO     = url.number( 'pr', Math.min( 2, window.devicePixelRatio || 1 ) );

// to restrict 'light' devices to 1x
// var PIXEL_RATIO     = url.number( 'pr', LITE ? 1 : Math.min( 2, window.devicePixelRatio || 1 ) );

var ANTIALIAS       = url.boolean( 'aa', !LITE && PIXEL_RATIO < 2 );

var LITE_PERLIN     = url.boolean( 'lp', MEDIUM || LITE );
var NUM_PAIRS       = url.number( 'l', LITE ? 225 : HANDHELD ? 350 : 1000 );
var FPS_CAP         = url.boolean( 'fpsc', MEDIUM || LITE );
var RAF             = url.boolean( 'raf', RECORD_MODE );

var QUALITY_OVERRIDE = url.boolean( 'lite' ) || url.boolean( 'medium' ) || url.boolean( 'hd' );

function trackEvent( a ) {
    ga( 'send', 'summary', a );
}

;( function( scope ) {

    var parser = new UAParser();
    var ua = parser.getResult();
    ua.gpu = GPU;
    ua.ascreenWidth = screen.width;
    ua.ascreenHeight = screen.height;

    if ( url.boolean( 'ua' ) ) {
        alert( JSON.stringify( ua, null, 4 ) );
    }

    var UNSUPPORTED = url.boolean( 'unsupported', 
        !WEBGL
        || ua.os.name === 'Android' 
        || ua.browser.name === 'IE' 
    );


    if ( !QUALITY_OVERRIDE && UNSUPPORTED ) {
        unsupported();
    } else { 
        supported();
    }

    document.body.classList.remove( 'no-js' );

    function unsupported() {
        landing.classList.add( 'unsupported' );
        trackEvent( 'unsupported' );
    }

    function supported() {

        if ( url.boolean( 'landing' ) ) return;
        trackEvent( 'supported' );

        Bootstrap.init( [

            'shaders/noise.glsl',
            'shaders/noise-lite.glsl',
            'shaders/background.vs',
            'shaders/background.fs', 
            'shaders/background-lite.vs',
            'shaders/background-lite.fs', 
            'shaders/pair.vs',
            'shaders/pair.fs', 
            'shaders/floor.fs', 
            'shaders/floor.vs', 
            'shaders/floor-lite.fs', 
            'shaders/floor-lite.vs', 
            'texture!textures/title.png', 
            'texture!textures/cred-aaf.png', 
            'texture!textures/cred-nhx.png', 
            'texture!textures/cred-popcorn.png', 
            // 'texture!textures/play.png', 
            // 'texture!textures/credit.png', 
            'texture!textures/pastel.gif', 
            'texture!textures/pastel2.jpg'
            

        ], function() {


            console.time( 'ready' );

            if ( url.boolean( 'nc' ) ) {
                document.body.style.cursor = 'none';
            }

            window.addEventListener( 'keydown', function( e ) {

                if ( e.keyCode == 65 ) {
                    var c = new THREE.Color( Pair.maleColors.next() );
                    bg.wipe( 1.0, c ).play();
                }

                if ( e.keyCode == 83 ) {
                    // floor.throb( 0.15 ).play();
                    floor.randomize();
                }

            }, false );
        
        // scene
            console.time( 'initScene' );
            initScene();
            console.timeEnd( 'initScene' );
            Loop.force();


            // pool
            console.log( 'PairPool.size = ' + NUM_PAIRS );
            console.time( 'PairPool.init' );
            PairPool.size = NUM_PAIRS;
            PairPool.init( onPairPoolInit, function( pct ) {
                Bootstrap.setProgress( 0.25 + pct * 0.75 );
            } );

        } );

        function onPairPoolInit() {
            Loop.force();

            console.timeEnd( 'PairPool.init' );
            

            // shots
            console.time( 'initShots' );
            initShots();
            console.timeEnd( 'initShots' );
            
            // Stage.freeze();
            // Bootstrap.stopLoader();

            onLoad();

        }

        function onLoad() {
            //about

            var firstNav = true;

            function nav( init ) {

                if ( window.location.hash === '#about' ) {
                    loadAboutImages();
                    Stage.showAbout();
                } else { 
                    if ( firstNav ) {
                        firstNav = false;
                        // Stage.freeze();
                        Controls.start();
                        _.defer(function(){
                            FREEZE_ACCELEROMETER = false;
                        });
                    }
                    Stage.hideAbout();
                }

            }

            _.defer( function() {
                document.body.classList.add( 'loaded' );
                Stage.showControls();
                nav();
                window.onhashchange = nav;
                console.timeEnd( 'ready' );    

                if ( RECORD_MODE ) { 
                    MUTE = true;
                    // TweenLite.ticker.useRAF( false );
                    // TweenLite.ticker.fps( 1 );

                    setTimeout(function(){
                        
                        Renderer.setSize( 1920, 1080 );
                        Renderer.setPixelRatio( 1 );    
                    }, 10)

                    setTimeout( function() {
                        Stage.unfreeze();
                        Three.record();
                    }, 100 )
                    

                }

            } );

            if ( FPS_CAP ) { 
                TweenLite.ticker.fps( 30 );
            }

            if ( TITLE_CAP ) {
                _.defer( function() {
                    Stage.hideControls();
                } );
            }

        }

        function loadAboutImages() {

            var images = document.querySelectorAll( '#about img' );
            for ( var i = 0, l = images.length; i < l; i++ ) { 
                images[ i ].setAttribute( 'src', images[ i ].getAttribute( 'data-src' ) );
            }

        }

    }

} )( this );
;( function( scope ) {

    scope.initScene = function() {
        

        Three.start( {
            antialias: false
        } );

        Renderer.setClearColor( 0xffffff, 1 );


        var geometry = new THREE.SphereGeometry( Scene.camera.far * 0.9, LITE ? 20 : 32, 12 );
        var vs = Assets( 'shaders/background.vs' );
        var fs = Assets( 'shaders/noise.glsl' ) + Assets( 'shaders/background.fs' );
        
        var vsLite = Assets( 'shaders/background-lite.vs' )
        var fsLite =  Assets( 'shaders/noise-lite.glsl' ) + Assets( 'shaders/background-lite.fs' );

        scope.bg = new Background();
        bg.init( LITE_PERLIN ? vsLite : vs, LITE_PERLIN ? fsLite : fs, geometry );

        var geometry = new THREE.CylinderGeometry( 3000, 3000, 0, 20 );
        
        var vs = Assets( 'shaders/floor.vs' );
        var fs = Assets( 'shaders/noise.glsl' ) + Assets( 'shaders/floor.fs' );

        var vsLite = Assets( 'shaders/floor-lite.vs' )
        var fsLite =  Assets( 'shaders/noise-lite.glsl' ) + Assets( 'shaders/floor-lite.fs' );


        console.timeEnd( 'initFloor' );

        console.timeEnd( 'initBackground' );

        scope.floor = new Background();

        floor.init( LITE_PERLIN ? vsLite : vs, LITE_PERLIN ? fsLite : fs, geometry );
        floor.mesh.position.y = -10;
        floor.mesh.updateMatrix();
        floor.solid( 0x027AC0 );

        console.time( 'initBackground' );

        
        scope.dennisTitle = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1024, 512 ), new THREE.MeshBasicMaterial( { 
            map: Assets( 'textures/title.png' ), 
            transparent: true
        } ) );


        scope.creditNHX = new THREE.Mesh( new THREE.PlaneBufferGeometry( 512, 256 ), new THREE.MeshBasicMaterial( { 
            map: Assets( 'textures/cred-nhx.png' ), 
            transparent: true, 
            color: 0x282828
        } ) );

        scope.creditAAF = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1024, 512 ), new THREE.MeshBasicMaterial( { 
            map: Assets( 'textures/cred-aaf.png' ), 
            transparent: true, 
            color: 0x282828
        } ) );

        scope.creditPopcorn = new THREE.Mesh( new THREE.PlaneBufferGeometry( 512, 256 ), new THREE.MeshBasicMaterial( { 
            map: Assets( 'textures/cred-popcorn.png' ), 
            transparent: true, 
            color: 0x282828
        } ) );
        

        dennisTitle.material.map.minFilter = THREE.LinearFilter;
        dennisTitle.material.map.magFilter = THREE.NearestFilter;
        
        creditNHX.material.map.minFilter = THREE.LinearFilter;
        creditNHX.material.map.magFilter = THREE.NearestFilter;

        creditAAF.material.map.minFilter = THREE.LinearFilter;
        creditAAF.material.map.magFilter = THREE.NearestFilter;

        creditPopcorn.material.map.minFilter = THREE.LinearFilter;
        creditPopcorn.material.map.magFilter = THREE.NearestFilter;


    }; 

} )( this );
;( function( scope ) {

    scope.initShots = function() {
        
        // Drift arpeggio intro
        // ------------------------------- 

        // var firstShot = new DriftShot( 50, 1.2, 0, true, -1, 40, false );
        // this 0.01 is new ....
        // addShot( 0.01.beats, firstShot );

        if ( url.boolean( 'single' ) ) {

            var singleShot = new TestShot();
            addShot( 0, singleShot, true );

            setTimeout(function() { 
                Stage.hideControls();
            }, 1000);


        } else { 

            var introShot = new IntroShot();
            addShot( 0.00.beats, introShot, true );
            Player.timeline.add(
                bg.wipe( 3.5.beats, 0xffffff )
            , 0.35.beats );
            var anotherDrift = new DriftShot( 50, 0.3, 30, false, undefined );
            anotherDrift.popFrequency = 1;
            addSimultaneousShot( 0.01.beats, anotherDrift, false )

        }


        // var sexyShot0 = new SexyShot();
        // sexyShot0.len = 15.0.beats;
        // sexyShot0.distance = 1.0;
        // sexyShot0.rx = 0;
        // sexyShot0.ry = QUARTER_PI;
        // addSimultaneousShot( 0.01.beats, sexyShot0, false );
       

        // var lonelyShot = new LonelyShot();
        // addSimultaneousShot( 0.01.beats, lonelyShot, false );
        // Player.timeline.to( introShot.camera.position, 5.0.beats, { y: 0 }, 0.01.beats )

        addCameraTween( 0.01.beats, 5.0.beats, Easing.Quintic.InOut, [0, 0, 100, 0, 0, 0, 0, 0, 0, 1, 50, 1, 30000] );

        Player.timeline.call( function() {
            
            Player.timeline.to( Scene.camera, 5.0.beats, { thetaRange: 0.1, phiRange: 0.1 }, 0.01.beats );
            Player.timeline.to( Scene.camera, 5.0.beats, { thetaRange: TWO_PI / 2, phiRange: PI / 2 }, 5.2.beats );

        }, [], this, 0.01.beats );




        // addShot( 6.0.beats, new DriftShot( 50, 0.6, 10, false, undefined, 0, false ) );
        // addShot 10,( new DriftShot( 50, 0.3, 20 ) ); 

        var thirdDriftShot = new DriftShot( 120, 0.8, 20, false, undefined );
        // thirdDriftShot.popFrequency = 2;
        thirdDriftShot.camera.position.z = 500;
        
        addShot( 8.5.beats, thirdDriftShot );
        // addShot( 12.0.beats, new DriftShot( 150, 0.004, 200, false, 1, -600 ) );

        // var sexyShot00 = new SexyShot();
        // sexyShot00.len = 7.0.beats;
        // sexyShot00.distance = 0.6;
        // sexyShot00.camera.position.z = 70;
        // addShot( 12.0.beats, sexyShot00 );
        // Player.timeline.$( 12.0.beats, bg.soak, bg, 5.0.beats )

        addShot( 14.0.beats, new DriftShot( 300, 0.8, 30, true, 1 ) );   
        // addShot 24,( new DriftShot( 170, 0.5, 800, true, 1 ) );


        // Swirl arpeggio intro
        // ------------------------------- 




        var sexyShot01 = new SexyShot();
        sexyShot01.len = 10.0.beats;
        sexyShot01.distance = 0.5;
        sexyShot01.camera.position.z = 70;
        sexyShot01.camera.distance = 70;
        sexyShot01.credit = true;
        sexyShot01.rx = 0;
        sexyShot01.ry = -HALF_PI / 2;

        var swirlShot = new SwirlShot();


        addShot( 18.0.beats, sexyShot01 );

        // var stupidIdea = new DriftShot( 100, 0.8, 5 );
        // stupidIdea.popFrequency = 3;
        // addSimultaneousShot( 18.0.beats, stupidIdea, false ); 

        Player.timeline.$( 18.0.beats, function() {  
            bg.position.y = 0;
            bg.updateMatrix();
            sexyShot01.camera.add( bg );
            bg.clear(); 
            bg.colorHigh = sexyShot01.pair.colorMale;
        } );

        Player.timeline.$( 18.0.beats, bg.soak( 6.0.beats ) );

        // addCut( 21.0.beats, swirlShot, [ 411.0211, -21.1656, -40.3824, -2.9398, 1.121, 2.9594, -0.0233, 0.844, 0.0369, 0.5345, 120, 1, 30000 ] )
        // addCut( 21.0.beats, swirlShot, [ 205.4160, -17.2923, -19.5788, 1.1508, 1.4336, -1.1473, 0.0455, 0.6856, -0.0430, 0.7253, 120, 1, 30000 ] );
        
        addShot( 23.9.beats, swirlShot );
        Player.timeline.$( 23.9.beats, bg.clear );
        // Player.timeline.$( 24.0.beats, bg.solid, bg, 0xffffff );

        var lastSwirlCut = [ 572.695, -9.9965, -2.8112, 1.8449, 1.5527, -1.845, 0.0062, 0.7088, -0.0062, 0.7053, 120, 1, 30000 ];
        var swirlZoomAnticipatePosition = [ 576.695, -9.9965, -2.8112, 1.8449, 1.5527, -1.845, 0.0062, 0.7088, -0.0062, 0.7053, 120, 1, 30000 ]
        addCut( 28.3.beats, swirlShot, lastSwirlCut )
        
     

        // Drop zoom
        // ------------------------------- 

        var swirlZoomAnticipate = new CameraTween();
        var swirlZoomAnticipateIn = 31.2.beats;

        swirlZoomAnticipate.target = swirlShot.camera;
        swirlZoomAnticipate.in = swirlZoomAnticipateIn;
        swirlZoomAnticipate.out = 31.6.beats;
        swirlZoomAnticipate.easing = Easing.Quadratic.Out;
        swirlZoomAnticipate.origin = lastSwirlCut;
        swirlZoomAnticipate.dest = swirlZoomAnticipatePosition;

        Player.timeline.call( swirlZoomAnticipate.start, [], swirlZoomAnticipate, swirlZoomAnticipateIn );

        var swirlZoom = new CameraTween();
        var swirlZoomIn = 31.6.beats;
        var swirlZoomArrive = [177.4396, -28.7578, -24.0123, 2.2665, 1.5707963267948966, -2.2773, 0.0523, 0.7506, -0.0599, 0.6559, 70, 1, 30000];

        swirlZoom.target = swirlShot.camera;
        swirlZoom.out = 32.0.beats;
        swirlZoom.easing = Easing.Exponential.In;
        swirlZoom.origin = swirlZoomAnticipatePosition;
        swirlZoom.dest = swirlZoomArrive;

        Player.timeline.call( swirlZoom.start, [], swirlZoom, swirlZoomIn );
        Player.timeline.call( swirlShot.freeze, [], swirlShot, 32.0.beats );
        Player.timeline.call( function() {
            creditPopcorn.visible = false;
            creditAAF.visible = false;
        }, [], this, 32.0.beats );

        // Player.timeline.$( swirlZoomIn, swirlShot, { lookAt: 'hero1' } );

        // Impact cuts
        // -------------------------------

        var swirlFarAway =[2213.7401, -11854.7396, 15926.2202, 0.6399, 0.111, -0.0823, 0.3116, 0.0656, -0.0216, 0.9477, 60, 1, 30000];
        addCut( 34.5.beats, swirlShot, swirlFarAway );
        Player.timeline.$( 34.5.beats, function() {
            bg.visible = false;   
        } );
        Player.timeline.$( 34.5.beats, swirlShot, { lookAt: undefined } );

        var secondInsertCut = [11342.6987, 199.8479, 647.309, -0.2995, 1.5111, 0.299, -0.0064, 0.6866, 0.006, 0.7269, 60, 1, 30000];
        addCut( 35.5.beats, swirlShot, secondInsertCut );
        Player.timeline.$( 35.5.beats, function() {
            bg.randomize();
            bg.visible = true;   
        } )
        Player.timeline.$( 35.5.beats, swirlShot, { lookAt: 'hero2' } );
        Player.timeline.$( 35.5.beats, function() {
            for ( var i = 0, l = swirlShot.pairs.length; i < l; i++ ) { 
                swirlShot.pairs[ i ].strokeInflate( 1 );
            }
        } )

        // Tom fill
        // ------------------------------- 

        var tomFillShot = new JumpShot();

        tomFillShot.useTitle = true;

        var tomFillTime = Time.bbd( 9, 3, 1 );
        var tomFillDur = Time.seconds( ( 32 + 10 / 24 ) - ( 31 + 20 / 24 ) );

        var d = Time.seconds( tomFillDur / 5 );
        addShot( Time.bbd( 9, 3, 1 ) - Time.seconds( 0.62 ), tomFillShot );

        Player.timeline.call( tomFillShot.jump, [], tomFillShot, tomFillTime);
        Player.timeline.call( tomFillShot.jump, [], tomFillShot, tomFillTime + d );
        Player.timeline.call( tomFillShot.insert, [], tomFillShot, tomFillTime );
        // Player.timeline.call( tomFillShot.color, [], tomFillShot, tomFillTime + Time.seconds( 0.18 ) );
        Player.timeline.call( tomFillShot.insert, [], tomFillShot, tomFillTime + Time.seconds( 0.1 ) );
        // Player.timeline.call( tomFillShot.color, [], tomFillShot, tomFillTime + Time.seconds( 0.31 ) );


        // Second impact set
        // -------------------------------

        var introImpactShot = new IntroImpactShot();
        addShot( Time.bbd( 10, 0, 2 ), introImpactShot );
        introImpactShot.offset = -2.0.div;

        Player.timeline.$( Time.bbd(10, 2, 2 ), function(){
            bg.randomize();
            bg.curdle( new THREE.Color(0xffffff), introImpactShot.pair.colorMale, 1.0.div );
        } );
        Player.timeline.$( Time.bbd(10, 2, 3 ), function(){
            bg.randomize();
            bg.curdle( new THREE.Color(0xffffff), introImpactShot.pair.colorMale, 1.0.div );
        } );
        Player.timeline.$( Time.bbd(10, 3, 2 ), function(){
            bg.randomize();
            bg.curdle( new THREE.Color(0xffffff), introImpactShot.pair.colorMale, 2.0.div );
        } );


        var introImpactShot2 = new IntroImpactShot();
        addShot( Time.bbd( 11, 0, 0 ), introImpactShot2 );
        introImpactShot2.curdleLength = Time.bbd( 0, 2, 0 );


        // Pre-verse fill
        // ------------------------------- 

        var laserFillShot = new JumpShot();
        laserFillShot.scale = 0.6;

        var i = 0;
        var jumps = _.filter( Volumes[ 'dennis bballstab' ].peaks, function( t ) {
            return t > Time.seconds( 38 ) && t < Time.seconds( 38.8 ) && i++ < 8;
        } );

        laserFillShot.count = jumps.length / 2;

        jumps.forEach( function( time, i ) { 
            if ( i < 4 ) {
                Player.timeline.call( laserFillShot.jump, [], laserFillShot, time );
            } else { 
                Player.timeline.call( laserFillShot.insert, [], laserFillShot, time - Time.seconds( 0.23 ) );
                Player.timeline.call( laserFillShot.color, [], laserFillShot, time );
            }
        }.bind( this ) );

        addShot( Time.bbd( 11, 2, 3 ), laserFillShot );




        // First verse rain  
        // ------------------------------- 

        var rainShot = new RainShot();
        rainShot.max = Time.bbd( 20, 0, 0 );
        rainShot.tracks = [ 
            'dennis 7-Kick 808 2', 
            'dennis drums', 
            'dennis sunvox', 
            'dennis pokey', 
            'dennis 20-808BD_T5D7_X', 
            'dennis crash2' 
        ];


        addShot( Time.bbd( 12, 0, 2 ), rainShot );

        addCut( Time.bars( 14 ), rainShot, RainShot.cuts.kicks );
        // Player.timeline.$( 14.0.bars, rainShot.camera, { distance: RainShot.cuts.kicks[ 2 ] } );
        addCut( Time.bars( 15 ), rainShot, RainShot.cuts.hihats );
        // Player.timeline.$( 15.0.bars, rainShot.camera, { distance: RainShot.cuts.hihats[ 2 ] } );
        addCut( Time.bars( 16 ), rainShot, RainShot.cuts.forward );
        addCut( Time.bars( 17 ), rainShot, RainShot.cuts.underneath );
        // Player.timeline.$( 17.0.bars, rainShot.camera, { distance: RainShot.cuts.underneath[ 2 ] } );
        addCut( Time.bars( 18.25 ), rainShot, RainShot.cuts.pokes );
        

        // function curdleKick( time ) {

        //     Player.timeline.$( time, function( ) {
        //         bg.colorLow = 0xffffff;
        //         bg.noiseScale = 100;
        //     } );
        //     Player.timeline.$( time, bg.throb( 0.1.beats ) );
        // }

        // curdleKick( Time.bbd( 14, 0, 0 ) + 0.5.div );
        // curdleKick( Time.bbd( 14, 1, 0 ) + 0.5.div );
        // curdleKick( Time.bbd( 14, 2, 0 ) + 0.5.div );
        // curdleKick( Time.bbd( 14, 2, 2 ) + 0.5.div );
        // curdleKick( Time.bbd( 14, 3, 0 ) + 0.5.div );
        // curdleKick( Time.bbd( 14, 3, 2 ) + 0.5.div );
        // curdleKick( Time.bbd( 15, 0, 0 ) + 0.5.div );

        // Grid shot 1
        // -------------------------------

        var gridHack = new GridShot();
        gridHack.cols = 0;
        gridHack.rows = 0;


        var gridShot = new GridShot();
        gridShot.padding = 10;
        gridShot.cols = 5;
        gridShot.rows = 3;
        gridShot.appearTracks = [ 'dennis funny' ];
        gridShot.impactIn = 25.0.bars;
        gridShot.impactTracks = [
            'dennis human',
            'dennis 28-Vox1C5',
            'dennis drums',
            'dennis fx2',
        ];
        gridShot.max = Time.bars( 26, 3 );
        // addShot( Time.bbd( 23, 2, 0 ), gridHack );
        addShot( Time.bbd( 23, 3, 0 ), gridShot );

        
        // Grid shot 2
        // -------------------------------

        var gridShot2 = new GridShot();
        gridShot2.padding = 10;
        gridShot2.cols = 5;
        gridShot2.rows = 3;
        gridShot2.appearTracks = [ 'dennis funny' ];
        gridShot2.max = 28.0.bars;
        addShot( Time.bars( 26, 2 ), gridShot2 );

        
        // Sexy Sexion 
        // -------------------------------

        Player.timeline.set( bg, { visible: false }, 27.0.bars )

        var sexyShot = new SexyShot();
        sexyShot.len = 1.0.bars;
        sexyShot.distance = 0.65;
        sexyShot.background = true;

        var sexyShot1 = new SexyShot();
        sexyShot1.len = 1.0.bars;
        sexyShot1.distance = 0.4;
        sexyShot1.camera.position.z = 65; 
        sexyShot1.camera.distance = 65;
        sexyShot1.background = true;

        var sexyShot2 = new SexyShot();
        sexyShot2.len = 1.0.bars; 
        sexyShot2.distance = 0.3;
        sexyShot2.background = true;
        sexyShot2.camera.position.z = 50;
        sexyShot2.camera.distance = 50;

        addShot( 27.0.bars, sexyShot )
        addShot( Time.bbd( 27, 2 ), sexyShot1 )
        addShot( Time.bbd( 27, 3 ), sexyShot2 );


        // Melody cutaway
        // -------------------------------

        var melodyShot = new MelodyShot1();
        melodyShot.offset = Time.div( 1 ); 
        addShot( 28.0.bars - melodyShot.offset, melodyShot );


        // Bullet time
        // -------------------------------

        var bulletTimeShot = new BulletTimeShot();
        addShot( 29.75.bars, bulletTimeShot );
        bulletTimeShot.in -= 1.0.bars;


        // Roller coaster
        // -------------------------------

        var snakeShot = new SnakeShot();
        snakeShot.duration = 1.0.bars;
        snakeShot.tracks = //_.keys( Volumes );
        [ 
            'dennis 7-Kick 808 2', 
            'dennis drums', 
            'dennis sunvox', 
            'dennis pokey', 
            'dennis 20-808BD_T5D7_X', 
            'dennis lasersynth', 
            'dennis supersaw', 
            'dennis human', 
            'dennis crash2' 
        ];
        addShot( 30.5.bars, snakeShot );


        var refuseShot = new RefuseShot();
        addShot( 32.25.bars, refuseShot );


        // Tables turn
        // -------------------------------

        addShot( 34.0.bars, new TableTurnShot() );
        addShot( 36.0.bars, new TableTurnShot() );


        // Finale
        // -------------------------------

        var parabolaShot = new ParabolaShot();
        parabolaShot.duration = Time.bbd( 8, 0, 2 );
        parabolaShot.out = 43.0.bars
        addShot( 38.0.bars, parabolaShot ); 

        addCut( 38.4.bars, parabolaShot, [1653.0005, 67.2793, 2539.1972, 0.0322, -0.5003, -0.0001, 0.0156, -0.2475, 0.004, 0.9687, 60, 1, 30000] );

        var melodyShot2 = new MelodyShot2();
        melodyShot2.offset = Time.div( 1 );
        addSimultaneousShot( 39.0.bars - melodyShot.offset, melodyShot2 );

        addCameraTween( 39.25.bars, 0.65.bars, Easing.Quadratic.InOut, [ 7023.3928, 455.9658, 1994.6711, -0.0203, 0.5741, 0, -0.0097, 0.2831, 0.0029, 0.959, 74.9, 1, 30000 ] );

        addCut( 40.0.bars, melodyShot2, [8555.6028, 201.9867, -1227.3187, -0.0342, 2.3509, 0, -0.0066, 0.9227, 0.0158, 0.3851, 90.6, 1, 30000] );//[ 4640.6824 * 2, 1269.0682, 416.5563, -1.5708, 0.0043, 0.0001, -0.7071, 0.0015, 0.0015, 0.7071, 90.6, 1, 30000 ] );
        addCut( 40.5.bars, melodyShot2, [ 4811.8696 * 2, -0.5813, 1741.9753, 0.1224, 0.7048, 0, 0.0574, 0.3445, -0.0211, 0.9368, 101.6, 1, 90000 ] );

        var latticeShot1 = new LatticeShot();
        // latticeShot1.duration = Time.bbd( 5, 1, 3 ); 
        addSimultaneousShot( Time.bbd( 41 ), latticeShot1, false );
        
        if ( !LITE && !HANDHELD ) {

            var followShot = new FollowShot();
            followShot.out = Time.bbd( 43 );
            followShot.tracks = _.keys( Volumes );
            addSimultaneousShot( Time.bbd( 40.9 ), followShot, false );
            Player.timeline.$( followShot.out, followShot.stop, followShot );

        }

        addCameraTween( Time.bbd( 41 ), Time.bbd( 2 ), Easing.Quadratic.In, [ -3306.5978, 64929.6176, -1626.5002, 1.5452, 0.6987, -2.9452, -0.1796, 0.6767, -0.693, -0.1718, 105.5, 1, 90000 ] );

        // Player.timeline.$( 43.0.bars, followShot.stop, followShot );

        addCameraTween( Time.bbd( 43, 2 ), 6.0.beats, Easing.Quadratic.In, [ -1878.9144, -400681.0666, -1465.7254, -0.1252, 0.1231, 0, -0.0624, 0.0614, 0.0038, 0.9962, 105.5, 1, 100000 ] );
        Player.timeline.$( 46.0.bars, latticeShot1.stop, latticeShot1 );
        Player.timeline.$( 42.0.bars, melodyShot2.stop, melodyShot2 );
        Player.timeline.$( 42.5.bars, parabolaShot.stop, parabolaShot );


        var floorShot = new FloorShot();
        addShot( Time.bbd( 44.5 ), floorShot );
        

        Player.timeline.fromTo( bg, 4.0.beats, { threshhold: 0.5 }, { threshhold: 0, ease: Linear.easeNone, immediateRender: false }, Time.bbd( 43 ) );
        // Player.timeline.to( bg, 2.0.beats, { noiseScale: 4, ease: Quint.easeOut }, Time.bbd( 43 ) );

        // Player.timeline.$( 41, function() {
          
        //     Scene.camera.add( bg );
        //     bg.position.set( 0, 0, 0 );
        //     bg.colorHigh = floor.colorHigh;
        //     bg.colorLow = Pair.maleColors.next();
        //     bg.threshhold = 0.5;
        //     bg.visible = true;
        //     bg.scale.set( 2.0, 2.0, 2.0 );  
        // } )

        // var snakeShot3 = new SnakeShot();
        // snakeShot3.tracks = _.keys( Volumes );
        // snakeShot3.duration = 2.21.bars;
        // addSimultaneousShot( Time.bbd( 43, 2, 0 ), snakeShot3, false );

        // var latticeShot2 = new ParabolaShot();
        // latticeShot2.duration = Time.bbd( 10, 0, 2 );
        // addShot( Time.bbd( 44, 1 ), latticeShot2 );


        // var dudShot = new DudTossShot();
        // addShot( 46.0.bars, dudShot );


    }

    var currentShots = [];

    function addShot( time, shot ) {
        
        currentShots.forEach( function( s ) { s.out = time; } );
        currentShots.length = 0;

        Player.timeline.$( time, Shot.stopAll );
        
        addSimultaneousShot( time, shot );

    }

    function showBackground( time ) {

        Player.timeline.$( time, function() {
            Scene.camera.add( bg );
        } );

    }

    function hideBackground( time ) {

        Player.timeline.$( time, function() {
            if ( bg.parent ) bg.parent.remove( bg );
        } );        
    }

    function addSimultaneousShot( time, shot, shotInitializesCamera ) {

        currentShots.push( shot );

        shot.in = time;

        var state;

        if ( shotInitializesCamera === false ) {
            Player.timeline.$( time, function() {
                state = Scene.camera.serialize();
            }, this );
        }

        Player.timeline.call( shot.start, [], shot, time );

        if ( shotInitializesCamera === false ) {
            Player.timeline.$( time, function() {
                shot.camera.unserialize( state );
            }, this );
        }

    }

    function addCut( time, shot, arr ) {
        Player.timeline.call( shot.camera.unserialize, [ arr ], shot.camera, time );
    }

    function addCameraTween( time, duration, ease, dest ) {
        var tween = new CameraTween();
        tween.easing = ease;
        tween.duration = duration;
        tween.dest = dest;
        Player.timeline.$( time, function() {
            tween.target = Scene.camera;
            tween.start();
        }, this );
    }


    scope.addShot = addShot;    
} )( this );

;( function( scope ) {
    
    scope.Background = Composition( 

        Group,

        function() {


        },
    
        {

            init: function( vs, fs, geometry ) {
               
                var uniforms = { 
                    time: {
                        type: 'v3',
                        value: new THREE.Vector3()
                    },
                    noiseScale: { 
                        type: 'f',
                        value: 3.0
                    },
                    threshhold: { 
                        type: 'f',
                        value: 0
                    }
                };
                
                var colorUniforms = {
                    colorLow: {
                        type: 'c',
                        value: new THREE.Color( 1, 1, 1 )
                    },
                    colorHigh: {
                        type: 'c',
                        value: new THREE.Color( 0, .73, .71 )
                    }
                }
 
                var material = new THREE.ShaderMaterial( { 
 
                    uniforms: _.extend( {}, uniforms, colorUniforms ),
                    vertexShader: vs,
                    fragmentShader: fs,
                    side: THREE.BackSide,
                    depthTest: false, 
                    depthWrite: false
 
                } );
 
                this.mesh = new THREE.Mesh( geometry, material );
                this.add( this.mesh );
 
                this.lastWipe = false;
 
                _.each( uniforms, function( uniform, k ) {
                    Object.defineProperty( this, k, {
                        get: function() {
                            return uniform.value;
                        },
                        set: function( v ) {
                            if ( uniform.type === 'v3' ) {
                                uniform.value.copy( v );
                            } else { 
                                uniform.value = v;
                            }
                        }
                    } )
                }, this );
                    
                _.each( colorUniforms, function( uniform, k ) {
                    Object.defineProperty( this, k, {
                        get: function() {
                            return uniform.value;
                        },
                        set: function( v ) {
                            uniform.value.set( v );
                        }
                    } )
                }, this );

            }, 

            clear: function() {
                this.colorLow.setRGB( 1, 1, 1 );  
                this.colorHigh.setRGB( 1, 1, 1 );  
            },

            solid: function( color ) {
                this.colorLow = color;
                this.colorHigh = color;
            },

            randomize: function() {
                this.noiseScale = random( 2, 8 );
                this.threshhold = random( 0.3, 0.7 );
                this.time.x = random( 0, 1000 );
                this.time.y = random( 0, 1000 );
                this.time.z = random( 0, 1000 );
            },

            wipe: function( dur, c ) {
                
                var color = 'color' + ( this.lastWipe ? 'Low' : 'High' );
                

                var timeline = new TimelineLite();
                    timeline.call( function() {
                        this[ color ] = c;
                    }, [], this, 0 );
                timeline.set( this.time, { x: random( 10 ), y: random( 10 ), z: random( 10 ) }, 0 );
                timeline.fromTo( this, dur, { threshhold: this.lastWipe ? 1 : 0 }, { threshhold: this.lastWipe ? 0 : 1, ease: Quad.easeInOut }, 0 );

                this.lastWipe = !this.lastWipe;

                return timeline;

            },

            splat: function( dur ) {
              
                var timeline = new TimelineLite();

                timeline.fromTo( this, dur, { threshhold: 0.7 }, { threshhold: 0.4, ease: Elastic.easeOut } );
                return timeline;

            },

            reset: function() {
                this.opacityLow = 1; 
                this.opacityHigh = 1; 
            }, 

            curdle: function( c1, c2, time ) {

                return new TimelineLite()
                    .call( function() {
                        this.colorLow = c1;
                        this.colorHigh = c2;
                    }, [], this, 0 )
                    .fromTo( this, time || 0.5.beats, { noiseScale: 0.25 }, { noiseScale: 3, ease: Expo.easeOut, immediateRender: false }, 0 )

            },

            soak: function( dur, thresh ) {
                var timeline = new TimelineLite();
                timeline.fromTo( this, dur, { threshhold: 0 }, { threshhold: thresh === undefined ? 0.5 : thresh } );
                return timeline;  
            }, 

            throb: function( dur ) {
                
                var timeline = new TimelineLite();

                var sign = this.lastThrob ? 1 : -1;
                var ease = Back.easeOut;

                timeline.to( this.time, dur, { x: random( 1, 2 ) * sign, y: -random( 1, 2 ) * sign, z: random( 1, 2 ) * sign, ease: ease }, 0 );
                timeline.to( this, dur, { noiseScale: random( 3, 4 ), ease: ease }, 0 );
                timeline.to( this, dur * 4, { threshhold: random( 0.2, 0.675 ), ease: Elastic.easeOut }, 0 );

                this.lastWipe = !this.lastThrob;

                return timeline;


            }
        }
    
    );

} )( this );
;( function( scope ) {

    scope.CameraTween = Composition( 
        
        Behavior,

        // todo: kill constructor
        function( target, duration, origin, dest, easing ) {

            this.target = target;
            this.duration = duration || 0;
            this.easing = easing || Easing.Linear.None;

            this.origin = origin;
            this.dest = dest;

            this._origin = new Camera();
            this._dest = new Camera();

        },

        {
            start: function() {

                if ( !this.origin )  {
                    this._origin.copy( this.target );
                } else { 
                    interpretArgument( this.origin, this._origin );
                }
                
                interpretArgument( this.dest, this._dest );


                if ( !this._dest ) {
                    throw new Error( 'Missing argument for Camera destination.' );
                }

                this.target.copy( this._origin );

            },
            update: function() {
                var k = clamp( this.easing( this.now / this.duration ), 0, 1 );
                this.target.quaternion.copy( this._origin.quaternion ).slerp( this._dest.quaternion, k );
                this.target.position.copy( this._origin.position ).lerp( this._dest.position, k );
                this.target.fov = lerp( this._origin.fov, this._dest.fov, k );
                this.target.updateProjectionMatrix();
            },
            stop: function() {
                this.target.copy( this._dest );
            } 
        }

    );


    function interpretArgument( target, camera ) {

        if ( target.instanceof && target.instanceof( Camera ) ) {

            camera.copy( target );    

        } else if ( target.instanceof && target.instanceof( Child ) ) { 

            camera.position.copy( target );
            camera.quaternion.copy( target );

        } else if ( _.isArray( target ) ) { 

            camera.unserialize( target );

        } else { 

            console.log( target );
            throw new Error( 'Unrecognized target type.' );

        }
    }   
    
} )( this );
var ExplodeBehavior = Composition( 
    Behavior,
    {
        Rate: 1
    },
    function() {
        this.speed1 = new THREE.Vector3();
        this.speed2 = new THREE.Vector3();
        this.vector = new THREE.Vector3();
        this.offset = new THREE.Vector3();
        this.decay = 0.5;
    },
    {
        start: function() {
            this.speed1.subVectors( this.target.getWorldPosition(), this.center );
            this.speed1.x += random.range( 1 );
            this.speed1.y += random.range( 1 );
            this.speed1.z += random.range( 1 );
            this.speed1.add( this.offset );
            this.speed2.copy( this.speed1 );
        },
        update: function() {

            this.speed1.multiplyScalar( this.decay );
            this.vector.copy( this.speed1 );
            this.vector.multiplyScalar( Player.delta * 10 * ExplodeBehavior.Rate );
            this.target.position.add( this.vector );

            this.vector.copy( this.speed2 );
            this.vector.multiplyScalar( Player.delta * 10 * ExplodeBehavior.Rate );
            this.target.position.add( this.vector );

        }
    } 
);


var FallBehavior = Composition( 
    Behavior,
    function() {

        var s = random( 0.8, 1 );
        this.s = s;

        this.origin = new THREE.Vector3(); 
        this.magnitude = 1;
        this.rx = random.range( PI ) * 0.1;
        this.ry = random.range( PI ) * s * 0.1;
        this.rz = random.range( PI ) * 0.1;
    },
    {
        start: function() {
            this.origin.copy( this.target.position );
        },
        update: function() {
            this.target.position.y = this.origin.y + - 700 * this.s * ( this.now * this.now ) * this.magnitude;
            this.target.rotation.x = this.now * this.rx - Math.PI / 2;
            this.target.rotation.y = this.now * this.ry;
            this.target.rotation.z = this.now * this.rz;
        } 
    } 
)

var HandheldBehavior = Composition( 

    Behavior,

    function() {
        this.magnitude = new THREE.Vector3( 200, 200, 0 );
    },

    {
        update: function() {
            this.target.position.x = ( noise( this.now / 10, 0 ) - 0.5 ) * this.magnitude.x;
            this.target.position.y = ( noise( this.now / 10, 1 ) - 0.5 ) * this.magnitude.y;    
        }
    }

);
;( function( scope ) {
    
    scope.HonkBehavior = Composition( 
        
        Behavior, 

        function() {
            this.origin = new THREE.Vector3();
            this.amplitude = 10;
            this.cameraScale = true;
        },

        {
            start: function() {
            
                this.origin.copy( this.target.scale );
                this.target.strokeInflate( 1 );

                
            },
            update: function() {
            
                var amplitude = this.amplitude * ( this.cameraScale ? Scene.camera.position.length() * 0.00035 : 1 );

                this.target.scale.copy( this.origin );


                this.target.scale.x += Volumes[ 'dennis bballstab' ].at() * amplitude;
                this.target.scale.y += Volumes[ 'dennis bballstab' ].at() * amplitude;
                this.target.scale.z += Volumes[ 'dennis bballstab' ].at() * amplitude;



            },

            stop: function() {
            
                this.target.scale.copy( this.origin );
                
            }
        }

    );

} )( this );
;( function( scope ) { 

    var vector = new THREE.Vector3();

    scope.Shake = Composition( 
        
        Behavior,

        function() {
            this.magnitude = new THREE.Vector3( 0, 2, 0 );
            this.origin = new THREE.Vector3();
            this.duration = Time.beats( 0.25 );
            this.dir = 1;
        },

        {
            start: function() {
                // this.origin.copy( this.target.position );
            },
            update: function() {

                vector.copy( this.magnitude );
                vector.multiplyScalar( this.dir * Easing.Exponential.Out( this.now / this.duration ) );
                // this.target.position.add( vector );
                // this.dir *= -1;

                // this.target.position.copy( this.origin );
                // this.target.position.x += this.magnitude.x * this.dir;
                // this.target.position.y += this.magnitude.y * this.dir;
                // this.target.position.z += this.magnitude.z * this.dir;
                // this.dir *= -1;
            },
            stop: function() {
                // this.target.position.copy( this.origin );
            } 
        }

    );

} )( this );
var StretchAppear = Composition( 
    
    Behavior,

    function() {
    
        this.duration = Time.seconds( 0.6, 3 );
        this.amplitude = 1;
        this.amplitude2 = random( 3, 4 );
        this.period = 0.25 * this.duration;
        this.period2 = 0.5 * this.duration;
        this.p3 = this.period / TWO_PI * ( Math.asin( 1 / this.amplitude ) || 0 );
        this.p32 = this.period2 / TWO_PI * ( Math.asin( 1 / this.amplitude2 ) || 0 );
        this.scale = 1;
    },

    {
        start: function() {
            this.target.visible = true;
            this.xPhased = random.chance();
        },
        update: function() {
            var t = clamp( this.now / this.duration, 0, 1 ) ;
            var s1 = this.ease1( t ) || 0.000001;
            var s2 = this.ease2( t ) || 0.000001;
            s1 *= this.scale;
            s2 *= this.scale;
            if ( this.xPhased ) {
                this.target.scale.set( s2, s1, 1 ) ;
            } else { 
                this.target.scale.set( s1, s2, 1 ) ;
            }
        },
        stop: function() {
            this.target.scale.set( this.scale, this.scale, this.scale );
        },
        ease1: function( t ) {
            return this.amplitude * Math.pow( 2, -10 * t ) * Math.sin( ( t - this.p3 ) * TWO_PI / this.period ) + 1;
        },
        ease2: function( t ) {
            return this.amplitude2 * Math.pow( 2, -10 * t ) * Math.sin( ( t - this.p32 ) * TWO_PI / this.period2 ) + 1;
        } 
    }

)

var SwarmBehavior = Composition( 

    Behavior,

    {
        Rate: 1
    },

    function() {
        
        this.width = 1000;
        this.height = 1000;
        this.depth = 6500;
        this.minSpeed = 100;
        this.maxSpeed = 200;
    },

    {

        start: function() {
            this.target.female.visible = random.chance();
            this.target.male.visible = !this.target.female.visible;
            this.target.male.position.set( 0, 0, 0 );
            this.target.position.set( random( -this.width / 2, this.width / 2 ), 
                random( -this.height / 2, this.height / 2 ), 
                random( -this.depth / 2, this.depth / 2 ) 
            );
            this.speed = random( this.minSpeed, this.maxSpeed );
            this.rotationSpeed = random( 0.01, 0.2 ) * random.sign();
        },

        update: function() {
            this.target.position.z -= this.speed * SwarmBehavior.Rate;
            this.target.rotation.z += this.rotationSpeed * SwarmBehavior.Rate;
            if ( this.target.position.z < -this.depth / 2 ) {
                this.target.position.set(
                    random( -this.width / 2, this.width / 2 ), 
                    random( -this.height / 2, this.height / 2 ), 
                    this.depth / 2
                )
            }
        } 

    }

)
;( function( scope ) {

    var maleColors = new Shuffler( [
        0x824199,
        0xE71F49,
        0x15B366,
        0xFBED00,
        0xF47C20,
        0x027AC0,
        0x04bab5
    ] );

    var femaleColors = new Shuffler( [
        0x555555,
        0x555555,
        0xaaaaaa,
        0xffffff,
        0xffffff
    ] );

    scope.Pair = Composition( 

        Group,

        {

            sparkleSeed: { type: 'v4', value: new THREE.Vector4() },  
            count: 0,
            maleInitialDistance: 180,
            maleColors: maleColors, 
            femaleColors: femaleColors, 
            defaultFogDistance: 10000, 
            fogUniforms: {
                far: { type: 'f', value: null },
            }, 
            setFogDistance: function( v ) {
                Pair.fogUniforms.far.value = v;   
            }
        },

        function() {

            var sizeFemale = 10 * 2;
            var sizeMale = random( 3, 5 ) * 2;

            var factoryFemale = factoriesFemale.next();
            var factoryMale = factoriesMale.next();

            var geometryFemale = factoryFemale( sizeFemale );
            var geometryMale = factoryMale( sizeMale );

            geometryMale.applyMatrix( matrix4.makeRotationX( Math.PI / 2 ) );
            geometryMale.applyMatrix( matrix4.makeRotationZ( random( Math.PI * 2 ) ) );
            geometryMale.applyMatrix( matrix4.makeTranslation( 0, 0, sizeFemale * 0.75 ) );

            euler.set( random( Math.PI / 4 ), random( Math.PI / 4 ), random( Math.PI / 4 ) );
            this.eulerFemale = euler.clone();
            geometryFemale.applyMatrix( matrix4.makeRotationFromEuler( euler ) );

            var bspFemale = new ThreeBSP( geometryFemale );
            var bspMale = new ThreeBSP( geometryMale );

            bspFemale = bspFemale.subtract( bspMale );
            var subtractedFemale = bspFemale.toGeometry();

            this.colorMale = maleColors.next();
            this.colorFemale = femaleColors.next();

            this.male = strokeMesh( geometryMale, this.colorMale );
            this.female = strokeMesh( subtractedFemale, this.colorFemale );

            this.add( this.male );
            this.add( this.female );

            this.id = Pair.count++;

            this.reset();

            Object.defineProperty( this, 'sparkle', {

                get: function() {
                    return this.female.material.uniforms.sparkleStrength.value;
                }, 
                set: function( v ) {
                   this.female.material.uniforms.sparkleStrength.value = v; 
                }

            } );

        },

        {

            reset: function() {

                this.visible = true;
                this.marked = false;
                this.rotation.reorder( 'XYZ' );

                this.add( this.male );
                this.add( this.female );

                this.position.set( 0, 0, 0 );
                this.rotation.set( 0, 0, 0 );
                this.scale.set( 1, 1, 1 ); 

                this.male.visible = false;    
                this.male.position.set( 0, 0, Pair.maleInitialDistance );
                this.male.rotation.set( 0, 0, 0 );
                this.male.scale.set( 1, 1, 1 ); 

                this.female.visible = true;
                this.female.position.set( 0, 0, 0 );
                this.female.rotation.set( 0, 0, 0 );
                this.female.scale.set( 1, 1, 1 );

                this.matrixAutoUpdate = true;
                this.male.matrixAutoUpdate = true;
                this.female.matrixAutoUpdate = true;

                this.strokeInflate( 1 );
                this.sparkle = 0;

            },

            strokeInflate: function( v ) {

                this.male.material.uniforms.strokeInflate.value = v;
                this.female.material.uniforms.strokeInflate.value = v;
                
            }, 

            jump: function( y ) {

                y = y || 0;

                return new TimelineLite()
                    .fromTo( this.position, 0.1, { y: -300 + y }, { y: y, ease: Expo.easeInOut, immediateRender: true }, -0.1 )
                    .to( this.position, 0.3, { y: 2 + y, ease: Linear.easeNone } ) 
                    .to( this.position, 0.5, { y: -500 + y, ease: Expo.easeIn } );
                
            },
            jump2: function( y ) {

                y = y || 0;

                return new TimelineLite()
                    .fromTo( this.position, 0.3, { y: -300 + y }, { y: y, ease: Expo.easeInOut, immediateRender: true }, -0.3 )
                    .fromTo( this.scale, 0.3, { y: 1.1, x:0.9, z:0.9 }, { y: 1, x: 1, z: 1, ease: Expo.easeInOut, immediateRender: true }, -0.3 )
                    .to( this.position, 0.1, { y: 1 + y, ease: Quad.easeOut } ) 
                    .to( this.position, 0.5, { y: -500 + y, ease: Expo.easeIn }, '+=0.4' );
                
            },
            straightenMale: function() {
                
            },
            straightenFemale: function() {
                this.female.quaternion.setFromEuler( this.eulerFemale ).inverse();
                this.male.quaternion.setFromEuler( this.eulerFemale ).inverse();
            },
            
            insert: function( speed, maleScale, femaleScale ) {

                speed = speed || 1;

                maleScale = maleScale || 1;
                femaleScale = femaleScale || 1;

                return new TimelineLite()

                    .set( this.male, { visible: true }, 0 )
                    .to( this.male.position, 0.4 / speed, { z: -4 * femaleScale, ease: Expo.easeIn }, 0 )
                    .to( this.male.scale, 0.2 / speed, { z: maleScale, ease: Back.easeOut }, 0 )

                    .to( this.female.position, 0.25 / speed, { z: -2.8 * femaleScale, ease: Back.easeOut }, 0.4 / speed )

                    .to( this.female.scale, 0.01 / speed, { z: femaleScale * 0.3, ease: Back.easeOut }, 0.4 / speed )
                    .to( this.female.scale, 0.13 / speed, { z: femaleScale, ease: Back.easeOut }, 0.41 / speed )

                    .to( this.male.scale, 0.01 / speed, { z: maleScale * 0.8, ease: Back.easeOut }, 0.4 / speed )
                    .to( this.male.scale, 0.1 / speed, { z: maleScale, ease: Back.easeOut }, 0.41 / speed )

            }, 
            
            insert3: function( speed, maleScale, femaleScale ) {

                speed = speed || 1;

                maleScale = maleScale || 1;
                femaleScale = femaleScale || 1;

                var mz = -4 * femaleScale;
                var fz = -2.8 * femaleScale;

                var rx= random( 0.4, 0.8 ) * random.sign();

                return new TimelineLite()

                    .set( this.male, { visible: true }, 0 )
                    .to( this.male.position, 0.4 / speed, { z: mz, ease: Expo.easeIn }, 0 )
                    .to( this.male.scale, 0.2 / speed, { z: maleScale, ease: Back.easeOut }, 0 )

                    .to( this.female.position, 0.25 / speed, { z: fz, ease: Back.easeOut }, 0.4 / speed )

                    .to( this.female.scale, 0.01 / speed, { z: femaleScale * 0.3, ease: Back.easeOut }, 0.4 / speed )
                    .to( this.female.scale, 0.13 / speed, { z: femaleScale, ease: Back.easeOut }, 0.41 / speed )

                    .to( this.male.scale, 0.01 / speed, { z: maleScale * 0.8, ease: Back.easeOut }, 0.4 / speed )
                    .to( this.male.scale, 0.1 / speed, { z: maleScale, ease: Back.easeOut }, 0.41 / speed )

                    .to( this.female.position, 0.5 / speed, { z: mz - 30, ease: Quint.easeOut }, 0.4 / speed )
                    .to( this.male.position, 0.5 / speed, { z: fz - 30, ease: Quint.easeOut }, 0.41 / speed )

                    .to( this.female.rotation, 0.5 / speed, { x: rx, ease: Quint.easeOut }, 0.4 / speed )
                    .to( this.male.rotation, 0.5 / speed, { x: rx, ease: Quint.easeOut }, 0.41 / speed )

            }, 
                        
            insert2: function( speed, maleScale, femaleScale ) {

                speed = speed || 1;

                maleScale = maleScale || 1;
                femaleScale = femaleScale || 1;

                return new TimelineLite()

                    .set( this.male, { visible: true }, 0 )
                    .to( this.male.position, 0.4 / speed, { z: 1.5 * maleScale, ease: Expo.easeIn }, 0 )

                    .to( this.position, 0.16/ speed, { z: this.position.z - 50.8 * femaleScale, ease: Circ.easeOut }, 0.405 / speed  )
                    // .to( this.position, 0.2/ speed, { z: fthis.position.z - 15 * femaleScale, ease: Expo.easeIn }  )

                    .to( this.female.scale, 0.01 / speed, { z: femaleScale * 0.8, ease: Back.easeOut }, 0.4 / speed )
                    .to( this.female.scale, 0.3 / speed, { z: femaleScale, ease: Back.easeOut }, 0.51 / speed )

                    .to( this.male.scale, 0.01 / speed, { z: maleScale * 0.8, ease: Back.easeOut }, 0.4 / speed )
                    .to( this.male.scale, 0.3 / speed, { z: maleScale, ease: Back.easeOut }, 0.51 / speed )

            }

        }

    );

    var matrix4 = new THREE.Matrix4();
    var euler = new THREE.Euler();
    var material;

    var factoriesFemale = new Shuffler( [
        function( size ) { return new THREE.CylinderGeometry( size / 2, size / 2, 20, random.int( 3, 7 ) ) },
        function( size ) { return new THREE.BoxGeometry( size, size, size ) },
        function( size ) { return new THREE.BoxGeometry( size, size, size / 3 ); }, 
        function( size ) { 
            var g = new THREE.CylinderGeometry( size, size, size / 1.25, 3 ); 
            g.applyMatrix( matrix4.makeRotationY( Math.PI ) );
            g.applyMatrix( matrix4.makeRotationX( Math.PI / 2 ) );
            return g;
        }
    ] );

    var factoriesMale = new Shuffler( [
        function( size ) { return new THREE.CylinderGeometry( size, size / 2, random( 25, 40 ), random.int( 3, 5 ) ) },
        function( size ) { return new THREE.CylinderGeometry( size, 0.1, random( 35, 40 ), random.int( 3, 5 ) ) },
        function( size ) { return new THREE.BoxGeometry( size * 4, size * 4, size / 2 ) },
        function( size ) { return new THREE.BoxGeometry( size * 4, size * 4, size / 2 ) },
        function( size ) { 
            var g = new THREE.CylinderGeometry( size * 2, size * 2, size / 2, 3 ); 
            g.applyMatrix( matrix4.makeRotationX( Math.PI / 2 ) );
            return g;
        }
    ] );

    function strokeMesh( geometry, color ) {


        var tex1 = Assets( 'texture!textures/pastel.gif' );
        var tex2 = Assets( 'texture!textures/pastel2.jpg' );
        


        material = material || new THREE.ShaderMaterial( { 
            vertexShader: Assets( 'shaders/pair.vs' ), 
            fragmentShader: Assets( 'shaders/pair.fs' ), 
            uniforms: { 
                color:    { type: 'c', value: null }, 
                center:   { type: 'v3', value: null }, 
                strokeInflate: { type: 'f', value: null }, 
                sparkleStrength: { type: 'f', value: null }, 
                sparkle1: { type: 't', value: null }, 
                sparkle2: { type: 't', value: null }, 
                sparkleSeed: Pair.sparkleSeed
            },
            attributes: { 
                vertexNormal: { type: 'v3', value: null }
            },
            shading: THREE.FlatShading
        } );

        var myMaterial = material.clone();


        geometry.computeBoundingSphere();

        myMaterial.uniforms.sparkle1.value = tex1;
        myMaterial.uniforms.sparkle2.value = tex2;
        myMaterial.uniforms.sparkleStrength.value = 0;
        myMaterial.uniforms.sparkleSeed = Pair.sparkleSeed;


        myMaterial.uniforms.center.value = geometry.boundingSphere.center;
        myMaterial.uniforms.color.value = new THREE.Color( color );
        
        geometry = strokeGeometry( geometry );

        return new THREE.Mesh( geometry, myMaterial );

    }

    function strokeGeometry( geometry ) {
        
        var g = geometry.clone();

        for ( var face, t, i = 0, l = g.faces.length; i < l; i++ ) { 

            face = g.faces[ i ];
            t = face.a;
            face.a = face.c;
            face.c = t;

            face.vertexNormals.reverse();
            face.vertexColors.reverse();


        }

        g.merge( geometry );
        // trigger face normals
        g.faces[ 0 ].vertexNormals.length = 0;

        g = new THREE.BufferGeometry().fromGeometry( g );
        g.computeVertexNormals();

        var normals = g.attributes.normal.array;
        for ( var i = 0; i < normals.length / 2; i++ ) { 
            normals[ i ] *= 500;
        }

        return g;

    }
} )( this );
var PairWrapper = Composition( 
    Group, 
    function( pair ) {
        this.pair = pair;
        this.add( pair );
    }
);
;( function( scope ) {
    
    var SpinBehavior = Composition( 
        Behavior,
        function() {
            this.rx = random.range( 0.02, 0.06 );
        },
        {
            update: function() {
                this.target.rotation.x += this.rx;
            } 
        } 
    )

    scope.BulletTimeShot = Composition( 

        PairShot,

        function() {
            this.camera.position.y = 100;
            // this.camera.unserialize( -244.4467,36.0035,203.9082,0.022,-0.5215,0,0.0106,-0.2578,0.0028,0.9661,60,1,30000 );
            // this.camera.unserialize( 151.4984,120.0397,-261.3698,0.1084,-0.0327,-0.0001,0.0542,-0.0163,0.0009,0.9984,96,1,30000 );
            // this.camera.unserialize( 142.4839,-117.4449,0,1.0874,-0.1255,0,0.5163,-0.0537,0.0325,0.8541,96,1,30000 );
        },

        {
            
            start: function() {
                
                bg.visible = false;

                floor.reset();
                floor.colorHigh = Pair.maleColors.next();
                floor.colorLow = Pair.maleColors.next();
                Renderer.setClearColor( floor.colorHigh, 1 );
                floor.position.x = 0;
                this.container.add( floor );

                for ( var i = 0; i < PairPool.size * 0.15; i++ ) {
                    var pair = this.next();
                    pair.position.y = random( 200, 1000 );
                    pair.position.x = random.range( 600 );
                    pair.position.z = random( -1000 );
                    pair.male.visible = true;
                    pair.male.position.z = 0;
                    this.timeline.to( pair.position, Time.bars( pair.position.y / 70 ), { y: 0, ease: Bounce.easeOut }, Time.beats( random( 4 ) ) );
                    var spin = this.behavior( SpinBehavior );
                    spin.target = pair;
                    spin.start();
                    pair.rotation.set( random( TWO_PI ), random( TWO_PI ), random( TWO_PI ) );
                }
                
                for ( var i = 0; i < PairPool.size * 0.2; i++ ) {
                    var pair = this.next();
                    pair.position.y = random( 200, 2100 );
                    pair.position.x = random.range( 5000 );
                    pair.position.z = random( -1000, -6000 );
                    pair.male.visible = true;
                    pair.male.position.z = 0;
                    this.timeline.to( pair.position, Time.bars( pair.position.y / 150 ), { y: 0, ease: Bounce.easeOut }, Time.beats( random( 4 ) ) );
                    var spin = this.behavior( SpinBehavior );
                    spin.target = pair;
                    spin.start();
                    pair.rotation.set( random( TWO_PI ), random( TWO_PI ), random( TWO_PI ) );
                }
                
            },

            update: function() {
                this.camera.position.x = ( noise( this.now / 10, 0 ) - 0.5 ) * 200;
                floor.time.y += 0.001;
                this.camera.position.y = 100 + ( noise( this.now / 10, 1 ) - 0.5 ) * 400;
            } 

        } 

    );
        
} )( this );

;( function( scope ) {
    
    var lastDir = random.sign();

    scope.DriftBehavior = Composition( 

        Behavior,

        {
            
            start: function( pct, y, z, offset, useZ ) {

                var distance = this.camera.frustumSlice( - this.camera.position.z ).width;
            

                this.z = z || 0;
                this.y = y || 0;
                this.duration = random( 10, 20 );
                this.distance = distance * pct;
                this.offset = offset || 0;

                this.slope = random.range( 1 / STAGE_ASPECT_RATIO );
                this.rz = random.range( 0.1, 0.2 );
                this.dir = lastDir;
                // lastDir *= -1;
                
                this.useZ = useZ;

                this.update();

            },

            update: function() {

                var xd = this.useZ ? 'z' : 'x'; 
                var zd = this.useZ ? 'x' : 'z';

                this.target.position[ xd ] = this.dir * ( this.offset + map( this.now + this.offset / 1000, 0, this.duration, -this.distance / 2, this.distance / 2 ) );
                this.target.position.y = this.slope * this.target.position[ xd ] + this.y;
                this.target.position[ zd ] = this.z;

                this.target.rotation.z = this.now  * this.rz;

            } 

        }

    );



    scope.DriftShot = Composition( 

        PairShot,

        function( cameraDistance, screenTravel, numPairs, useZ, dir, offset, useMidi ) {

            this.camera.position.z = cameraDistance;
            this.screenTravel = screenTravel;
            this.numPairs = numPairs || 1;

            this.useZ = useZ;
            this.offset = offset || 0;

            this.dir = dir;

            this.useMidi = useMidi === undefined ? true : useMidi;

        },

        {
            start: function() { 


                lastDir = this.dir || random.sign();

                var behavior = this.behavior( DriftBehavior );
                behavior.target = this.next();
                behavior.camera = this.camera;
                behavior.start( 
                    this.screenTravel,
                    0,
                    0,
                    this.offset,
                    this.useZ );

                this.camera.distance = this.camera.position.distanceTo( behavior.target.position );

                for ( var i = 1; i < this.numPairs; i++ ) {

                    var behavior = this.behavior( DriftBehavior );
                    behavior.target = this.next();
                    behavior.target.scale.setLength( random( 0.85, 1.2 ) );
                    behavior.camera = this.camera;
                    behavior.start( 
                        random( 0.4, 0.6 ), 
                        random.range( 200 ), 
                        map( i, 0, this.numPairs, -600, this.useZ ? 600 : 0 ),
                        random.range( 1000 ) + this.offset,
                        this.useZ 
                    ); 

                }

                if ( this.useMidi ) {

                    var popEvents = _.filter( Midi.events, where( { 

                        type: 'noteOn', 
                        track: 2, 
                        time: between( this.in, this.out ) 

                    } ) );

                    popEvents.forEach( function( note, i ) { 

                        if ( this.popFrequency && i % this.popFrequency != 1 ) {
                            return;
                        }

                        var pair = this.next();
                        pair.scale.set( 0.0001, 0.0001, 0.0001 );
                        var behavior = this.behavior( DriftBehavior );
                        behavior.camera = this.camera;
                        behavior.target = pair;
                        behavior.start( 
                            random( 0.6, 1.0 ), 
                            random( 200 ) * random.sign(), 
                            random( -300, 300  ),
                            random( 100 ) * random.sign() - random( -300, 400 ),
                            this.useZ
                        );

                        var jiggle = this.behavior( PairJiggle );
                        jiggle.target = pair;
                        jiggle.scale = random( 0.85, 1.2 );

                        this.timeline.$( note.time - this.in, jiggle.start );

                    }, this );

                }

            }

        } 

    );
} )( this );
;( function( scope ) {
    
    var vec = new THREE.Vector3();
    var box = new THREE.Box3();
    var quat = new THREE.Quaternion();

    scope.FloorShot = Composition( 

        PairShot,

        function() {

            this.camera.position.y = 3;
            this.camera.position.z = 425;
            this.camera.rotation.z = 0.075;
            // this.camera.lookAt( Scene.position );

            this.top = 2000;
            this.bottom = -9000;

        },

        {
            
            start: function() {

                this.pairs = this.getPct( 1 / 4 );


                bg.visible = false;
                Renderer.setClearColor( 0xffffff, 1 );

                floor.reset();
                floor.colorHigh = 0xffffff;
                floor.noiseScale = 10;
                floor.colorLow = 0xeeeeee;
                this.container.add( floor );

                floor.position.y = this.bottom;

                this.planetPairs = this.getPct( 1 / 8 );

                this.planetPairs.forEach( function( p, i ) {
                    var j = i / this.planetPairs.length;
                    var d = lerp( 400, 0, j );
                    var a = j * Math.PI * 6 + random( 0.5 ) * random.sign();

                    // p.position.set( random.range(), random.range(), random.range() );
                    p.position.y = lerp( this.top - 500, this.bottom + 1000, i / this.planetPairs.length );
                    p.position.x = this.camera.position.x + Math.cos( a ) * d;
                    p.position.z = this.camera.position.z + Math.sin(  a ) * d - 600;
                    this.container.add( p );

                    p.female.visible =  i % 2 === 0;
                    p.male.visible = !p.female.visible;
                    p.male.position.set( 0, 0, 0 );

                    var s = random( 1, 2 );
                    p.scale.set( s, s, s );

                }, this );


                this.pairs.forEach( function( p, i ) {

                    // if ( i % 2 === 0 ) {
                    //     p.female.visible = false;
                    //     p.male.position.set( 0, 0, 0 );
                    // } else {
                    //     p.male.visible = false;
                    //     // p.female.rotation.y = Math.PI * 2 * random();
                    // }

                    p.male.visible = true;
                    p.male.position.set( 0, 0, 0 );
                    p.matrixAutoUpdate = false;
                    p.straightenFemale();
                    p.rotation.reorder('YXZ');
                    // p.rotation.x -= Math.PI / 2;
                    // p.rotation.y += random.angle();
                    // p.rotation.x = random( Math.PI * 2 );
                    // var i = Math.round( random.range() );
                    // if ( i === -1 ) {
                    //     p.rotation.x = Math.PI / 2;
                    // } else if ( i === 1 ) {
                    //     p.rotation.x = -Math.PI / 2;
                    // }


                    p.position.set( random.range( 500 ), 0, random( 0, -1000 ) );
                    p.position.setLength( Math.pow( random(), 0.5 ) * 1500 + 100 )
                    p.position.x += this.camera.position.x;
                    p.position.z += this.camera.position.z;
                    p.position.y = this.bottom;
                    p.updateMatrix();

                }, this );

                // this.hero = this.next();
                // this.hero.straightenFemale();
                // this.hero.male.position.z = 1200;
                // this.hero.male.visible = true;
                // this.hero.male.position.set( 0, 0, 0 );
                // // this.hero.male.rotation.z += random.range( PI / 16, PI / 8 );
                // this.hero.male.rotation.y += random.range( PI / 16, PI / 8 );
                // this.hero.male.rotation.z += random.range( PI / 16, PI / 8 );
                // this.hero.position.z = 240;
                // this.hero.rotation.reorder( 'YXZ' );
                // this.hero.rotation.y += Math.PI / 1.8
                // this.hero.position.x = -30;
                // this.hero.position.y = -20;

                // box.setFromObject( this.hero.female );

                // // this.hero.female.position.y += ( box.max.y - box.min.y );
                // // this.hero.female.position.z += ( box.max.x - box.min.x ) / 2;

                // this.hero.male.position.y = this.hero.female.position.y;
                // this.hero.rotation.reorder( 'ZXY' );

                // var b = 1.75.beats;//2.0beats;

                this.timeline.fromTo( this.camera.position, 2.0.beats, { y: this.top }, { y: this.bottom, ease: Quad.easeIn }, 0 );
                this.timeline.to( this.camera.position, 1.75.div, { y: this.bottom + 20, ease: Quad.easeOut }, 2.0.beats );

                // this.timeline.$( 2.0.beats + b, 0.75.beats, this.hero.male.position, { z: 4 } );
                // this.timeline.$( 2.75.beats + b, Group.prototype.toWorld, this.hero.male );
                // this.timeline.fromTo( this.hero.male.scale, 2.5.beats, { z: 0.01 }, { z: 1, ease: Elastic.easeOut }, 2.75.beats + b );
                // this.timeline.to( this.hero.rotation, 1.1.beats, { z: PI / 7, ease: Expo.easeOut }, 2.75.beats + b );
                // this.timeline.to( this.hero.rotation, 0.375.beats, { z: 0, ease: Bounce.easeOut }, 4.0.beats + b );
                // this.timeline.to( this.hero.position, 1.9.beats, { x: -75, ease: Expo.easeOut }, 2.75.beats + b );
                // this.timeline.$( 2.75.beats + b, 0.25.beats, this.hero.male.position, { y: 55, ease: Expo.easeOut } );
                // this.timeline.$( 3.00.beats + b, 0.35.beats, this.hero.male.position, { y: 40 } );
                // this.timeline.$( 2.75.beats + b, 1.5.beats, this.hero.male.position, { x: 60, z: 250 } );
                // this.timeline.$( 2.75.beats + b, 1.5.beats, this.hero.male.rotation, { z: TWO_PI, y: random.range( PI, PI * 2 ) } );
                // this.timeline.$( 3.35.beats + b, 0.5.beats, this.hero.male.position, { y: -90, ease: Expo.easeIn } );

                // this.timeline.$( 2.75.beats, Group.prototype.toWorld, this.hero.male );
                // this.timeline.$( 2.75.beats, 0.4.beats, this.hero.male.position, { x: 0, y: 30, z: 230, ease: Expo.easeOut } );
                // this.timeline.$( 2.75.beats, 0.4.beats, this.hero.male.rotation, { y: rot.y / 2, z: rot.z / 2, ease: Expo.easeOut } );

                // this.timeline.$( 3.15.beats, 0.3.beats, this.hero.male.position, { x: 60, y: -10, z: 250, ease: Expo.easeIn } );
                // this.timeline.$( 3.15.beats, 0.3.beats, this.hero.male.rotation, { y: rot.y, z: rot.z, ease: Expo.easeIn } );


                Scene.camera.thetaRange = TWO_PI / 10;
                Scene.camera.phiRange = PI / 4;

            },

            update: function() {



            }

        } 

    );
        
} )( this );

;( function( scope ) {
    
    scope.FollowShot = Composition( 

        PairShot,

        function() {
            this.camera.fov = 90;
            this.rollStrength = 10;
            this.camera.rotation.reorder( 'YXZ' );
        },

        {
            
            start: function() {

                this.course = [];

                var seed = random( 200 );
                var speed = 10;
                var x = 0;
                var z = 0;
                var i = 0;

                Volume.forPeaks( this.tracks, this.in, this.out, 

                    function( time, info ) {
                        
                        var vol = Volumes[ info.track ].at( time );
                        var offset = 0;// map( vol, 0, 1, 0, Time.div( 1 ) );

                        var pair = this.next();
                        
                        var r = time * ( TWO_PI  );
                        // var d = map( vol, 0, 1, 100, 30 );
                        var d = 1000;

                        var container = new Group();
                        container.add( pair );

                        pair.rotation.x = r + PI;
                        pair.sparkle = 1;

                        pair.position.x = 0 -Math.cos( r ) * d;
                        pair.position.y = 2350 - Math.sin( r ) * d;
                        

                        pair.scale.set( 7, 7, 7 );

                        pair.visible = false;

                        var position = function() {
                            Scene.camera.passenger.add( container );
                            container.toWorld();
                            pair.position.z = -2400 * map( this.now, 0, this.duration, 1, 3 );
                        };

                        this.timeline.set( pair, { visible: true }, time  );
                        this.timeline.$( time - 0.3, position, this );

                        var y = pair.position.y;

                        this.timeline.fromTo( pair.position, 0.1, { y: -400 + y }, { y: y, ease: Expo.easeInOut, immediateRender: false }, time - 0.3 )
                            .to( pair.position, 0.5, { y: 2 + y, ease: Linear.easeNone }, time ) 
                            .to( pair.position, 2, { y: -10000, ease: Expo.easeIn }, time + 0.3 );

                        this.timeline.add( pair.insert( 1.8 ), time - 0.2 );

                    }, this );

            }

        } 

    );
        
} )( this );

;( function( scope ) {
    
    scope.GridShot = Composition( 

        PairShot,

        function() {
            this.camera.position.z = 300;
            this.camera.fov = 60;
            this.rows = 5;
            this.cols = 5;
            this.padding = -100;
            this.camera.distance = this.camera.position.z;

            this.appearTracks = [];
            this.impactTracks = [];

            // this.cy = -600;

        },

        {
            
            start: function() {


                Renderer.setClearColor( 0xffffff, 1 );

                this.height = this.camera.frustumSlice().height - this.padding * 2;
                this.width = this.camera.frustumSlice().width - this.padding * 2;

                // console.log( this.height, this.width, this.padding, this.camera, this.camera.frustumSlice().left, this.camera.frustumSlice().top );

                var rowCenter = ~~( this.cols / 2 );
                var colCenter = ~~( this.rows / 2 );

                this.pairs = this.get( this.rows * this.cols );

                this.pairs.forEach( function( p, i ) {

                    var col = ~~( i / 5 )
                    var row = i % 5;

                    p.position.y = ( col - colCenter ) / this.cols * -this.width;
                    p.position.x = ( row - rowCenter ) / this.rows * this.height * 0.9;
                    p.rotation.x = random.range( Math.PI / 8, Math.PI / 4 );
                    p.rotation.y = random.range( Math.PI / 8, Math.PI / 4 );
                    p.male.position.z = 500; 
                    p.visible = false;
                    p.appear = this.behavior( StretchAppear );
                    p.appear.amplitude = 2;
                    p.appear.target = p;

                }, this );

                this.pairs = _.shuffle( this.pairs );

                // console.log( this.pairs );


                this.trackEvents = {};
                this.appearTracks.forEach( function( name ) { 
                    this.trackEvents[ name ] = Volumes[ name ].peaksBetween( this.in, this.max );
                }, this  );
                

                var i = 0;
                _.each( this.trackEvents, function( trackEvents, trackName ) { 
                    trackEvents.forEach( function( time ) { 
                        time -= this.in;
                        if ( i < this.pairs.length ) {
                            var appear = this.pairs[ i ].appear;
                            this.timeline.call( appear.start, [], appear, time + Time.seconds( 0.1 )  );
                        }
                        i++;
                    }, this )
                }, this );

                this.trackEvents = {};
                this.impactTracks.forEach( function( name ) { 
                    this.trackEvents[ name ] = Volumes[ name ].peaksBetween( this.impactIn, this.max );
                }, this  );

                var i = 1;
                _.each( this.trackEvents, function( trackEvents, trackName ) { 
                    
                    // console.log( trackEvents.length, trackName );

                    trackEvents.forEach( function( time ) { 
                        
                        time -= this.in; 

                        if ( i < this.pairs.length ) {
                            
                            var pair = this.pairs[ i ];
                            var appear = pair.appear;

                            this.timeline.add( pair.insert( 1 ), time - Time.seconds( 0.4 ) );
                            this.timeline.to( pair.male.position, Time.beats( 1 ), { z: -40, ease: Quad.easeOut }, time + 0.1 );
                            this.timeline.to( pair.female.position, Time.beats( 1 ), { z: -40, ease: Quad.easeOut }, time + 0.1 );
                            this.timeline.to( pair.rotation, Time.beats( 1 ), { x: pair.rotation.x + 0.3, ease: Quad.easeOut }, time + 0.1 );
                            
                            this.timeline.call( appear.start, [], appear, time );
                            this.timeline.set( appear, { amplitude: 5 }, time );
                
                            this.timeline.call( Renderer.setClearColor, [ pair.colorMale, 1 ], Renderer, time )
                            this.timeline.call( Renderer.setClearColor, [ 0xffffff, 1 ], Renderer, time + Time.frames( 2 ) )

                            if ( trackName == 'dennis drums' ) {
                                var shake = this.behavior( Shake );
                                shake.target = this.camera;
                                this.timeline.call( shake.start, [], shake, time );
                                this.timeline.call( shake.stop, [], shake, time + 0.1 );
                            }

                        }

                        i++;

                    }, this )

                }, this );

                // var zoom = this.behavior( CameraTween );
                // zoom.target = this.camera;
                // zoom.dest = [-41.0921,-22.0631,-272.0158,-0.0802,0.0881,0,-0.04,0.044,0.0018,0.9982,60,1,30000];
                // zoom.duration = Time.beats( 0.5 );
                // zoom.easing = Easing.Exponential.In;

                // this.timeline.call( zoom.start, [], zoom, this.in );

                this.pairs.forEach( function( p, i ) {
                    this.timeline.to( p.scale, Time.beats( 0.3 ), { x: 0.001, y: 0.001, z: 0.001, ease: Back.easeIn }, this.max - Time.beats( 0.5 ) - this.in + i / this.pairs.length * Time.beats( 0.25 ));
                }, this )

            },

            update: function() {
                // this.camera.position.z = cmap( this.now, 0, this.max - this.in, 0, 1 );
                // this.camera.position.z = Easing.Quadratic.InOut( this.camera.position.z );
                // this.camera.position.z = map( this.camera.position.z, 0, 1, 300, 350 );
                // this.pairs.forEach( function( pair ) { 
                //     console.log( pair.scale.length(), pair.visible );
                // }, this );
            } 

        } 

    );
        
} )( this );

;( function( scope ) {
    
    var StreamBehavior = Composition( 

        Behavior,

        {
            Rate: 1
        },

        function() {
            
            this.width = 18000;
            this.height = 13000;
            this.depth = 6500;

        },

        {

            start: function() {
                this.speed = random( 1000, 20000 );
                this.target.position.y = random.range( this.height / 2 );
                this.target.position.x = random.range( this.width / 2 );
                this.target.position.z = random( -this.depth );
                this.rx = random.range( 20 );
                this.ry = random.range( 20 );
            },

            update: function() {
                this.target.position.x += this.speed * StreamBehavior.Rate * Player.delta;
                this.target.position.x += this.width / 2;
                this.target.position.x %= this.width;
                this.target.position.x -= this.width / 2;
                this.target.rotation.x += this.rx * StreamBehavior.Rate * Player.delta;
                this.target.rotation.y += this.ry * StreamBehavior.Rate * Player.delta;
            } 

        }

    )

    scope.IntroImpactShot = Composition( 

        PairShot,

        function() {
            // this.camera.unserialize( 0,-0.2488,499.6,0,0,1.1872,0,0,0.5593,0.8289,95.5,1,30000 );
            this.camera.position.z = 4000;
            this.camera.distance = 60;
            this.camera.thetaRange = 0;
            this.camera.phiRange = 0;
            this.camera.fov = 95.5;
            this.offset = 0;
        },

        {
            
            start: function() {

                bg.clear();

                bg.reset();
                this.camera.add( bg );
                
                StreamBehavior.Rate = 2;

                Renderer.setClearColor( 0xffffff, 1 );

                var pair = this.next();

                this.pair = pair;
                
                pair.rotation.reorder( 'YXZ' );
                pair.rotation.x = random.range( 0.03, QUARTER_PI / 2 );
                pair.rotation.y = random.range( 0.03, QUARTER_PI / 2 );
                pair.rotation.z = random( TWO_PI );

                var zoom = this.behavior( CameraTween );
                var dest = new Camera();
                dest.position.z = 60;

                // var roll = random.angle();

                // this.camera.rotation.z = roll;
                // dest.rotation.z = roll;

                zoom.target = this.camera;
                zoom.dest = dest;
                zoom.easing = Easing.Back.In;
                zoom.duration = 1.0.div;

                var shake = this.behavior( Shake );
                shake.target = this.camera;
                shake.duration = 4.0.div;
                shake.magnitude.set( 0, 5, 0 );

                var dest = new THREE.Vector3( 0, 0, -50 );
                dest.applyEuler( pair.rotation );
                dest.add( pair.position );


                this.timeline.$( this.offset + 2.0.div, zoom.start, zoom );
                this.timeline.$( this.offset + 2.0.div + zoom.duration, function() {
                    this.camera.thetaRange = PI;
                    this.camera.phiRange = PI;
                }.bind( this ) );
                this.timeline.$( this.offset + 2.0.div, 1.0.div, pair.position, { z: -6000, y: 3000 }, { z: 0, y: 0, immediateRender: true } );
                this.timeline.$( this.offset + 3.0.div, StreamBehavior, 'Rate', 0.1 );
                this.timeline.$( this.offset + 3.0.div, 8.0.div, pair.position, { x: 2 } );
                this.timeline.$( this.offset + 6.0.div, StreamBehavior, 'Rate', 0.005 );
                this.timeline.$( this.offset + 6.0.div, 6.0.div, pair.position, { x: dest.x, y: dest.y, z: dest.z } );
                this.timeline.$( this.offset + 6.0.div, 6.0.div, pair.rotation, { x: pair.rotation.x - 2 } );
                this.timeline.$( this.offset + 6.0.div, Renderer.setClearColor, Renderer, pair.colorMale, 1 );
                this.timeline.$( this.offset + 6.0.div - 0.3.sec, pair.insert( 1.5 ) );
                this.timeline.$( this.offset + 6.0.div - 0.2.sec, pair.male, 'visible', true );

                this.timeline.$( this.offset + 6.0.div, bg.curdle( new THREE.Color( 0xffffff ), pair.colorMale, this.curdleLength ) );

                var dest = new THREE.Vector3( 0, 0, -2800 );
                dest.applyEuler( pair.rotation );
                dest.add( pair.position );


                this.timeline.$( this.offset + 10.0.div, 8.0.div, pair.position, { x: dest.x, y: dest.y, z: dest.z } );
                this.timeline.$( this.offset + 10.0.div, 8.0.div, pair.rotation, { x: pair.rotation.x - 120 } );
                this.timeline.$( this.offset + 10.0.div, StreamBehavior, 'Rate', 2 );
                this.timeline.$( this.offset + 10.0.div, Renderer.setClearColor, Renderer, 0xffffff, 1 );



                this.get( PairPool.size / 8 ).forEach( function( pair ) { 

                    var stream = this.behavior( StreamBehavior );
                    stream.target = pair;
                    stream.start();
                    
                    pair.scale.setLength( random( 3, 6 ) );

                    var behavior = this.behavior( HonkBehavior );
                    behavior.cameraScale = false;
                    behavior.amplitude = 80;
                    behavior.target = pair;
                    behavior.start();

                }, this );


            },

            update: function() {

                
                bg.time.x += 0.01 * 0.5 * 0.125;
                bg.time.y += 0.001 * 0.5 * 0.125;
            } 

        } 

    );
        
} )( this );

;( function( scope ) {
    

    scope.IntroShot = Composition( 

        PairShot,

        function() {

            this.camera.position.z = 100;
            this.camera.distance = 100;
            this.camera.far = 50000;
            this.camera.fov = 50;
            this.count = 50;
            this.jumpIndex = 0;
            this.insertIndex = 0;
            this.colorIndex = 0;
            this.scale = 1;
            this.offsetY = -100000;

            this.timeline2 = new Timeline( { paused: false } );

            // Scene.camera = this.camera;


            this.container.position.y = 0;
            this.camera.position.y = this.offsetY;


            // dennisPlay.position.z = -200;
            // dennisPlay.position.y = this.offsetY;
            // dennisPlay.scale.multiplyScalar( 0.1 );

            // dennisCredit.position.y = this.offsetY + 2000;
            // dennisCredit.position.z = -5000;
            // dennisCredit.scale.multiplyScalar( 6.350852961085884 );

            dennisTitle.position.z = -35000;
            dennisTitle.position.y = this.offsetY;
            dennisTitle.scale.multiplyScalar( 5 * 9 );

            this.jumpSide = 1;

            this.container.add( dennisTitle );
            // this.container.add( dennisCredit );
            // this.container.add( dennisPlay );

            this.planetContainer = new THREE.Object3D();
            this.planetContainer.position.y = this.offsetY;

            this.container.add( this.planetContainer );

            this.ry = random.range( 0.0001, 0.0002 );
            this.rx = random.range( 0.0001, 0.0002 );


            this.pairs = this.get( this.count );
            this.pairs.forEach( function( p, i ) {
                p.position.y = this.offsetY - 300;
                p.scale.set( this.scale, this.scale, this.scale );
            }, this );

            Stage.frozenLoop.on( 'update', this.update );

            this.planetPairs = [];

        },

        {
            
            start: function() {

                this.lastJump = Date.now() + 2200;
                this.nextJumpTime = random( 900, 1800 );

                dennisTitle.material.color = new THREE.Color( 0x282828 );

                var slice = this.camera.frustumSlice();
                this.scatterPairs = this.get( ( PairPool.size - this.count ) / 5 );
                this.scatterPairs.forEach( function( p, i ) {

                    p.position.y = map( i, 0, this.scatterPairs.length, this.offsetY + 40000, 0 );
                    var d = random( 1000, 4000 );
                    var a = random( Math.PI + 0.8, 2 * Math.PI - 0.8 );
                    p.position.x = Math.cos( a ) * d;
                    p.position.z = Math.sin( a ) * d;
                    p.strokeInflate( 0.65 );
                    if ( p.position.y < -500 ) {
                        // p.male.position.set( random(), random(), random() );
                        p.scale.setLength(  map( i, 0, this.scatterPairs.length, 22, 1 ) + random( 6 ) );
                        // p.male.position.setLength( random( 200, 1000 ) );
                        // p.male.visible = true;
                    }
                }, this );

                this.planetPairs = this.get( ( PairPool.size - this.count ) / 4 );

                this.planetPairs.forEach( function( p, i ) {
                    // p.position.set( random.range(), random.range(), random.range() );

                    p.position.y = Math.cos( i / this.planetPairs.length * Math.PI * 2 );
                    p.position.z = Math.sin( i / this.planetPairs.length * Math.PI * 2 );
                    p.position.x = random.range();
                    p.position.setLength( i % 2 === 0 ? random( 10000, 30000 ) : random( 45000, 48000 ) );
                    p.scale.setLength( random( 50, 100 ) );
                    this.planetContainer.add( p );

                    p.rx = random( 0.002 ) * random.sign();
                    p.ry = random( 0.002 ) * random.sign();

                    p.female.visible = false;// i % 4 === 0;
                    p.male.visible = !p.female.visible;
                    p.male.position.set( 0, 0, 0 );

                }, this );


                // hehehe
                _.defer( function() {
                    Scene.camera.thetaRange = TWO_PI / 10;
                    Scene.camera.phiRange = PI / 4;
                    Controls.centerOffsetInstant();
                    bg.solid( 0x824199 );
                    
                }.bind( this ) )
                bg.position.y = this.offsetY;
                bg.updateMatrix();
                this.container.add( bg );

            },

            stop: function() {
                Stage.frozenLoop.off( 'update', this.update );
                clearInterval( this.interval ); 
            }, 

            jump: function() {
            
                var pair = this.pairs[ this.jumpIndex % this.pairs.length ];
                var r = random();
                var z = map( r * r, 0, 1, -100, 15 );
                this.jumpIndex++;
                var r2 = random();
                pair.position.x = 20 + 180 / 3 * ( 1 - r2 * r2 * r2 ) * this.jumpSide;
                pair.position.z = z;
                pair.position.y = 0;
                pair.male.position.z = 250;

                this.jumpSide *= -1;
                var timeline = pair.jump2( this.offsetY + random( 150 / 4 ) );
                timeline.add( pair.insert2( 1.0 ), 0.5 );
                timeline.call( function() {
                    // bg.solid( pair.colorMale );
                }, [], this, 0.9 )
            },

            color: function() {
                // bg.colorLow = this.pairs[ this.colorIndex % this.pairs.length ].colorMale.getHex();
                // bg.colorHigh = bg.colorLow;
                // this.colorIndex++;
            },

            insert: function() {

                var pair = this.pairs[ this.insertIndex % this.pairs.length ];
                this.insertIndex++;

                var speed = 1.6;

                this.timeline2.add( pair.insert( speed ), this.now );
                // this.timeline.call( Renderer.setClearColor, [ pair.colorMale, 1 ], this.now - )


            },

            update: function() {

                this.planetContainer.rotation.x += 0.00025;
                for ( var i = 0, l = this.planetPairs.length; i < l; i++ ) { 
                    var pp = this.planetPairs[ i ];
                    pp.rotation.x += pp.rx;
                    pp.rotation.y += pp.ry;
                }

                if ( !RECORD_MODE && !TITLE_CAP && Date.now() - this.lastJump > this.nextJumpTime ) {
                    this.lastJump = Date.now();
                    this.nextJumpTime = random( 900, 1800 );

                    this.jump();
                }
                // this.planetContainer.rotation.y += this.ry;
            }

        } 

    );
        
} )( this );

;( function( scope ) {
    
    scope.JumpShot = Composition( 

        PairShot,

        function() {

            this.camera.position.z = 100;
            this.camera.distance = this.camera.position.z;
            this.count = 2;
            this.jumpIndex = 0;
            this.insertIndex = 0;
            this.colorIndex = 0;
            this.scale = 1;

        },

        {
            
            start: function() {

                bg.position.y = 0;
                bg.updateMatrix();
                this.camera.add( bg );

                if ( this.useTitle ) {
                    dennisTitle.position.set( 0, 0, -530 );
                    dennisTitle.scale.set( 1, 1, 1 );
                    dennisTitle.material.color = new THREE.Color( 0xffffff );
                    this.container.add( dennisTitle );
                    this.camera.thetaRange = 0;
                    this.camera.phiRange = 0;
                }

                var slice = this.camera.frustumSlice();
                var x = slice.width / ( this.count );
                this.pairs = this.get( this.count )
                this.pairs.forEach( function( p, i ) {
                    p.position.x = map( i + 1, 0, this.count + 1, -slice.width / 2, slice.width / 2 ) ;
                    p.position.y = -300;
                    p.scale.set( this.scale, this.scale, this.scale );
                    p.rotation.x = random.range( 0.2, 0.4 );
                }, this );
                bg.solid( 0 );
            },

            jump: function() {
            
                var pair = this.pairs[ this.jumpIndex % this.pairs.length ];
                this.jumpIndex++;
                var slice = this.camera.frustumSlice();
                this.timeline.add( pair.jump( random( slice.height / 8 ) ), this.now );

            },

            color: function() {
                // bg.colorLow = this.pairs[ this.colorIndex % this.pairs.length ].colorMale.getHex();
                // bg.colorHigh = bg.colorLow;
                bg.solid( this.pairs[ this.colorIndex % this.pairs.length ].colorMale );
                this.colorIndex++;
            },

            insert: function() {

                var pair = this.pairs[ this.insertIndex % this.pairs.length ];
                this.insertIndex++;

                var speed = 1.6;

                this.timeline.add( pair.insert( speed ), this.now );
                // this.timeline.call( Renderer.setClearColor, [ pair.colorMale, 1 ], this.now - )

            },

            update: function() {

            }

        } 

    );
        
} )( this );

;( function( scope ) {
    
    scope.LatticeShot = Composition( 

        PairShot,

        function() {
            if ( LITE || HANDHELD ) {

                this.dimension = 4;
                this.size = 7000 * ( 6 / 5 ) * ( 5 / 4 );    
            } else { 

                this.dimension = 5;
                this.size = 7000 * 6 / 5;
            }
            // this.camera.position.z = this.size * 3;
            // this.camera.unserialize( 2127.3655, 435.1724, 21640.2702, 0.9703, -0.1164, -0.0862, 0.4674, -0.0314, -0.0109, 0.8834, 60, 1, 30000 );
        },

        {
            
            start: function() {
                
                bg.reset();
                this.camera.add( bg );
                bg.noiseScale = 4;


                this.timeline.fromTo( this.container.scale, 5.0.div, { x: 0.01, y: 0.01, z: 0.01 }, { x: 1, y: 1, z: 1, ease: Expo.easeOut, immediateRender: true }, 0.1 );
                this.container.position.y = 63000;

                this.meteors = this.get( 5 );
                this.meteors.forEach( function( pair, i  ) { 
                    
                    var s = i === 4 ? 400 : 180;
                    pair.scale.set( s, s, s );
                    pair.position.z = -10000;
                    pair.sparkle = 1;
                    var container = new Group();
                    container.add( pair );
                    // container.rotation.x = random.angle();
                    // container.rotation.y = random.angle();
                    container.rotation.z = random.angle();

                }, this );

                ExplodeBehavior.Rate = 1;

                this.pairs = this.get( Math.pow( this.dimension, 3 ) );
                this.pairs.forEach( function( pair, i ) { 

                    pair.sparkle = 1;

                    var x = i % this.dimension;
                    var y = ~~( i / this.dimension ) % this.dimension;
                    var z = ~~( i / ( this.dimension * this.dimension ) );

                    pair.position.x = ( x - ~~( this.dimension / 2 ) ) * this.size;
                    pair.position.y = ( y - ~~( this.dimension / 2 ) ) * this.size;
                    pair.position.z = ( z - ~~( this.dimension / 2 ) ) * this.size;

                    pair.scale.set( 60, 60, 60 );
                    pair.rotation.set( random( TWO_PI ), random( TWO_PI ), random( TWO_PI ) );
                    pair.male.visible = false;
                    pair.male.position.z = 700;

                    pair.explode = this.behavior( ExplodeBehavior );
                    pair.explode.target = pair;
                    pair.explode.decay = 0.5;

                    pair.fall = this.behavior( FallBehavior );
                    pair.fall.target = pair;
                    pair.fall.magnitude = 7;

                    this.timeline.to( pair.scale, 0.5.beats, { z: 0.01, x: 0.01, y: 0.01 }, 3.3.bars - i * 0.025 );

                }.bind( this ) );

                // this.extras = this.get( ` ).forEach( function( pair ) { 
                    
                //     pair.position.x = random.range( this.size * 2, this.size * 4 );
                //     pair.position.z = random.range( this.size * 2, this.size * 4 );
                //     pair.position.y = random.range( this.size * 2, this.size * 4 );
                //     pair.scale.set( 5, 5, 5 );
                //     pair.male.visible = false;

                // }, this );

                this.pairs = _.shuffle( this.pairs );

                Volume.forPeaks( _.keys( Volumes ), this.in, this.out, 
                function( time, info ) {

                    var t = Math.max( 0, time - 0.3 );

                    if ( info.noteIndex < this.pairs.length ) {
                        this.timeline.add( this.pairs[ info.noteIndex ].insert( 1.5 ), t );
                        this.timeline.set( this.pairs[ info.noteIndex ].male, { visible: true }, t );
                    }

                }, this );

                this.course = [];
                var x = 0, z = this.camera.position.z, speed = 10;
                for ( var now = 0, inc = Time.frames( 1 ); now < this.duration; now += inc ) {
                    var angle = ( noise( x * 0.00001, z * 0.00001, now * 0.003 ) - 0.5 ) * 4 * TWO_PI;
                    x -= Math.sin( angle ) * speed;
                    z -= Math.abs( Math.cos( angle ) * speed );
                    this.course.push( [ x, z, angle ] );
                }

                var m = 0;
                var meteorStrike = function( time, dur1 ) {

                    time -= this.in;

                    this.timeline.$( time, this.explode, this, m );
                    var meteor = this.meteors[ m++ ];

                    var dur = 1.0.bars;// dur || 0.5.beats ;
                    var dist = 100000 * dur / 0.5.beats;
                     dur1 = dur1 || 1.5.div;
                    var dist1 = 300;


                    this.timeline.$( time - dur, function() {
                        Scene.camera.passenger.add( meteor.parent );
                        // meteor.position.y = 1500;
                    } );

                    this.timeline.$( time - 0.1.sec, function() {
                        meteor.parent.toWorld();
                        // bg.threshhold -= 0.05;
                    } );

                    this.timeline.$( time - dur, dur, meteor.position, { x: -dist }, { x: -dist1, immediateRender: true } );
                    this.timeline.$( time, dur1, meteor.position, { x: -dist1 }, { x: dist1 } );
                    this.timeline.$( time, dur1, meteor.rotation, { x: random.angle() / 30, y: random.angle() / 30 } );
                    this.timeline.$( time + dur1, dur, meteor.position, { x: dist1 }, { x: dist }, { x: random.angle() * 30, y: random.angle() * 30 } );
                    this.timeline.$( time + dur + dur1, dur, meteor, { visible: false } );


                }.bind( this );

                meteorStrike( Time.bbd( 42, 2, 0 ) );
                meteorStrike( Time.bbd( 42, 2, 2 ) );
                meteorStrike( Time.bbd( 42, 3, 0 ) );
                meteorStrike( Time.bbd( 42, 3, 2 ) );
                meteorStrike( Time.bbd( 43, 0, 0 ), 1.0.beats );
                
                this.timeline.$( Time.bbd( 43 ) - this.in, ExplodeBehavior, 'Rate', 6 )
                this.timeline.$( Time.bbd( 43 ) - this.in, function() {
                    bg.toWorld();
                    Renderer.setClearColor( 0xffffff, 1 );
                    this.pairs.forEach( function( pair ) { 
                        pair.explode.speed2.setLength( 10 );
                        pair.fall.start()
                    }, this );

                }, this )
                
            },

            explode: function( meteorIndex ) {
              
                this.pairs.forEach( function( pair ) { 
                    pair.explode.center = this.meteors[ meteorIndex ].getWorldPosition();
                    pair.explode.start();
                    pair.explode.speed2.setLength( 6 );
                }, this );

            },

            update: function() {
                if ( Player.now > Time.bbd( 43, 1 ) ) {
                    Scene.camera.lookAt( this.meteors[ 4 ].getWorldPosition() );
                }
                    Pair.sparkleSeed.value.y -= 0.01;

                // this.camera.position.y = pos[ 0 ];
                // this.camera.position.z = pos[ 1 ];
                // this.camera.rotation.x = pos[ 2 ];

                // if ( prev ) {
                //     this.camera.rotation.z += ( -80 * ( prev[ 2 ] - pos[ 2 ] ) - this.camera.rotation.z ) * 0.05;
                // }

            } 

        } 

    );
        
} )( this );

;( function( scope ) {
    
    scope.LonelyShot = Composition( 

        PairShot,

        function() {
        },

        {
            
            start: function() {
                var z = random( TWO_PI );
                this.pair = this.next();
                this.pair.scale.setLength( 1.0 );
                this.timeline.fromTo( this.pair.position, 12.0.beats, { x: -100 }, { x: 40 }, 0 );
                this.timeline.fromTo( this.pair.rotation, 12.0.beats, { z: z }, { z: z + random( PI / 4, PI / 2 ) * random.sign() }, 0 );

            },

            update: function() {
            } 

        } 

    );
        
} )( this );


;( function( scope ) {
    
    scope.MelodyShot1 = Composition( 

        PairShot,

        function() {

            this.camera.position.z = 225;
            this.camera.distance = this.camera.position.z;
            this.camera.position.y = 30;

            this.divisionScale = 60;
            this.intervalScale = 15;

            this.melody = [ 5, null, 7, null, null/*bend*/, null, 0, -2, 0, null, -2, null, -2, null, 0, null, 2, 5, null/*lob*/ ];

        },

        {
            
            start: function() {

                bg.reset();
                this.camera.add( bg );
                bg.visible = true;
                bg.randomize();

                bg.colorHigh = Pair.maleColors.next();
                bg.colorLow = Pair.maleColors.next();
                bg.noiseScale = 2.5;
                this.melody.forEach( function( interval, div ) { 
                    
                    if ( interval === null ) return;

                    var pair = this.next();
                
                    this.position( pair.position, interval, div );

                    pair.rotation.reorder( 'YXZ' );

                    pair.rotation.x = random.range( QUARTER_PI, HALF_PI );

                    pair.rotation.y = -HALF_PI;
                    pair.male.position.z = 300;
                    pair.male.visible = false;

                    this.timeline.add( pair.insert( 1.3 ), Time.div( div - 0.15 ) - 0.46 + this.offset );

                }, this );
                
                // bend

                var bender = this.next();
                bender.rotation.reorder( 'YXZ' );
                bender.male.position.z = 1000;

                var intStart = 0;
                var divStart = 3.4;
                var intEnd = 2;
                var divEnd = 4;

                var start = this.position( bender.position, intStart, divStart );
                var end = this.position( {}, intEnd, divEnd );
                end.ease = Expo.easeOut;

                bender.rotation.y = -HALF_PI;
                bender.rotation.x = Math.atan2( end.y - start.y, end.x - start.x );

                this.timeline.add( bender.insert( 1.3 ), Time.div( divStart ) - 0.46 + this.offset );
                this.timeline.to( bender.position, Time.div( divEnd - divStart ), end, Time.div( divStart ) + this.offset );

                this.timeline.to( bender.scale, Time.div( divMid ), { z: 0.25, x: 1.5, y: 1.5, ease: Expo.easeOut }, Time.div( divStart ) + this.offset );
                this.timeline.fromTo( bender.scale, Time.div( divEnd ), { z: 0.01, x: 2, y: 2 }, { z: 1, x: 1, y: 1, ease: Elastic.easeOut, immediateRender: false }, Time.div( divStart + 1 ) + this.offset );

                var lobber = this.next();
                lobber.rotation.reorder( 'YXZ' );
                lobber.male.position.z = 1000;

                var intMin = 0;
                var intMax = 7;

                var divStart = this.melody.length - 1 - 0.45;
                var divMid = 2.5;
                var divEnd = 4;

                var start = this.position( lobber.position, intMin, divStart );
                
                var mid = this.position( {}, intMax, divStart + divMid );
                mid.ease = Expo.easeOut;

                var end = this.position( {}, - 3, divStart + divEnd );
                end.ease = Expo.easeIn;

                var angle = Math.atan2( mid.y - start.y, mid.x - start.x );

                lobber.rotation.y = -HALF_PI;
                lobber.rotation.x = angle;

                this.timeline.add( lobber.insert( 1.3 ), Time.div( divStart ) - 0.46 + this.offset );

                this.timeline.to( lobber.scale, Time.div( divMid ), { z: 0.25, x: 1.5, y: 1.5, ease: Expo.easeOut }, Time.div( divStart ) + this.offset );
                this.timeline.to( lobber.scale, Time.div( divEnd - divMid ), { z: 1, x: 1, y: 1, ease: Elastic.easeOut }, Time.div( divStart + divMid ) + this.offset );
                this.timeline.fromTo( lobber.scale, Time.div( divEnd ), { z: 0.01, x: 2, y: 2 }, { z: 1, x: 1, y: 1, ease: Elastic.easeOut, immediateRender: false }, Time.div( divStart + divEnd ) + this.offset );
                
                this.timeline.to( lobber.position, Time.div( divMid ), mid, Time.div( divStart ) + this.offset );
                this.timeline.to( lobber.position, Time.div( divEnd - divMid ), end, Time.div( divStart + divMid ) + this.offset );

                end.x += Time.div( 4 ) * this.divisionScale;
                this.timeline.to( lobber.position, Time.div( divEnd - divMid ), end, Time.div( divStart + divEnd ) + this.offset );

                this.timeline.to( lobber.rotation, Time.div( divMid ), { x: 0, ease: Expo.easeOut }, Time.div( divStart ) + this.offset );
                this.timeline.to( lobber.rotation, Time.div( divEnd - divMid ), { x: -HALF_PI - 0.2, ease: Expo.easeIn }, Time.div( divStart + divMid ) + this.offset );
                this.timeline.to( lobber.rotation, Time.div( divEnd - divMid ), { x: -HALF_PI - 0.3, ease: Expo.easeIn }, Time.div( divStart + divEnd ) + this.offset );

                this.update();

            },

            position: function( vector, interval, div ) {
                
                vector.x = div * this.divisionScale;
                vector.y = interval * this.intervalScale;

                return vector;

            },
 
            update: function() {

                this.camera.position.x = ( Time.to.div( this.now ) - Time.beats( 3 ) ) * this.divisionScale;

            } 

        } 

    );
        
} )( this );

;( function( scope ) {
    
    scope.MelodyShot2 = Composition( 

        PairShot,

        function() {

            this.camera.unserialize( 3527.0987, 1790.2596, 2178.8685, -0.2575, -0.0234, -0.1249, -0.1274, -0.0196, -0.0634, 0.9896, 97.9, 1, 30000 );

            this.divisionScale = 60;
            this.intervalScale = 15;

            this.melody = [ 5, null, null, null, 
                            7, null, null, null, 
                            5, null, null, null, 
                            7, null, null, null, 
                            5, null, null, null,
                            null, 0, 1, 4, null, 3, null, 1, null, 0 ];

            this.container.scale.setLength( 15 );
            this.container.position.y = 1200;

        },

        {
            
            start: function() {
                
                bg.reset();
                this.camera.add( bg );
                
                
                this.melody.forEach( function( interval, div ) { 

                    if ( interval === null ) return;

                    div /= 2;

                    var pair = this.next();

                    pair.sparkle = 1;                
                    this.position( pair.position, interval, div );

                    pair.rotation.reorder( 'YXZ' );

                    pair.rotation.x = random.range( QUARTER_PI, HALF_PI );

                    pair.rotation.y = -HALF_PI;
                    pair.male.position.z = 1500;
                    pair.male.visible = false;

                    this.timeline.add( pair.insert( 1.3 ), Time.div( div - 0.15 ) - 0.4 + this.offset );
                    this.timeline.$( div.div * 0.25, div.div * 0.6, pair.position, { y: pair.position.y + 800 }, 
                        { y: pair.position.y, ease: Expo.easeOut, immediateRender: true } );

                }, this );
                
                this.update();


            },

            position: function( vector, interval, div ) {
                
                vector.x = div * this.divisionScale;
                vector.y = interval * this.intervalScale;

                return vector;

            },

            update: function() {

                // this.camera.position.x = ( Time.to.div( this.now ) - Time.beats( 3 ) ) * this.divisionScale;

            }

        } 

    );
        
} )( this );

;( function( scope ) {
    
    scope.OutroImpactShot = Composition( 

        PairShot,

        function() {
        },

        {
            
            start: function() {

                Renderer.setClearColor( 0, 1 );

                var pair = this.next();
                this.pair = pair;

                pair.rotation.reorder( 'YXZ' );
                pair.rotation.x = random.range( QUARTER_PI / 2, HALF_PI * 0.3 );
                pair.rotation.z = random( TWO_PI );
                pair.male.position.z = 600;

                var shake = this.behavior( Shake );
                shake.target = this.camera;
                shake.duration = Time.div( 0.5 );
                shake.magnitude.set( 1, 5, 0 );

                this.timeline.add( pair.insert( 1.8 ), 0 );
                this.timeline.call( shake.start, [], shake, Time.div( 1.5 ) );
                this.timeline.call( Renderer.setClearColor, [ pair.colorMale ], Renderer, Time.div( 1 ) );
                this.timeline.call( Renderer.setClearColor, [ 0, 1 ], Renderer, Time.div( 1.2 ) );

                var dest = new THREE.Vector3();
                dest.copy( pair.position );

                var vel = new THREE.Vector3( 0, 0, -600 );
                vel.applyEuler( pair.rotation );
                dest.add( vel );

                this.timeline.to( pair.position, Time.div( 30 ), { x: dest.x, y: dest.y, z: dest.z }, Time.div( 1.5 ) );
                // this.timeline.to( pair.rotation, Time.div( 30 ), { x: -5 }, Time.div( 2 ) );
                this.update();



            },

            update: function() {
                this.camera.position.x = ( noise( this.now / 10, 0 ) - 0.5 ) * 100;
                this.camera.position.y = ( noise( this.now / 10, 1 ) - 0.5 ) * 100;
                // this.camera.lookAt( this.pair.position );
            } 

        } 

    );
        
} )( this );

;( function( scope ) {
    
    var G = 980 * 4;

    scope.ParabolaShot = Composition( 
        PairShot,
        function() {

            this.timeScale = 1000;
            this.camera.unserialize( -989.2992,470.5407,1087.0526,-0.0207,-1.2376,0,-0.0084,-0.58,-0.006,0.8145,60,1,30000 );


            // this.camera.unserialize( 760.6408, 743.3592, -1071.3161, -0.0925, -1.6163, -0.0001, -0.032, -0.7222, -0.0335, 0.6901, 60, 1, 30000 );

            this.throbFrequency = 2.0.beats;
            this.camera.phiRange /= 2;
            
            this.minZ = 1850;
            this.maxZ = -1850;

        },  
        {
            start: function() {

                Renderer.setClearColor( 0xffffff, 1 );
                bg.reset();
                this.camera.add( bg );
                bg.threshhold = 2;

                var throbTimeline = new TimelineLite( { paused: true } );
                var throbAttack = 0.3;
                var ta = 0.5;
                var tb = 0.55;
                throbTimeline.fromTo( floor, this.throbFrequency / 2 * ( throbAttack ), { threshhold: ta }, { threshhold: tb, ease: Elastic.easeOut } );
                throbTimeline.fromTo( floor, this.throbFrequency / 2 * ( throbAttack ), { threshhold: tb }, { threshhold: ta, ease: Elastic.easeOut }, this.throbFrequency / 2 );
                this.throbTimeline = throbTimeline;

                var a = Pair.maleColors.next();
                var b = Pair.maleColors.next();

                floor.reset();
                Renderer.setClearColor( a, 1 );
                bg.colorHigh = floor.colorHigh = a;
                floor.colorLow = b;
                bg.colorLow = 0xffffff;
                floor.noiseScale = 1.0;
                this.container.add( floor );

                for ( var i = 0; i < Time.bars( 8 ); i += Time.div( 0.25 ) ) {
                    
                    // var pair = this.next();
                    // pair.position.x = i * this.timeScale;
                    // pair.rotation.x = HALF_PI;
                    // pair.male.visible = true;
                    // pair.female.visible = false;
                    // pair.male.position.z = 0;

                    // var jump = this.behavior( JumpBehavior );
                    // jump.target = pair;
                    // jump.duration = Time.div( random( 4, 5 ) );
                    // this.timeline.call( jump.start, [], jump, i - jump.duration );
                    // this.timeline.fromTo( pair.scale, random( 0.05, 0.1 ), { z: 0.1 }, { z: 1, ease: Elastic.easeOut, immediateRender: false }, i );
                    // this.timeline.fromTo( pair.position, 0.5, { z: 0 }, { z: 40, ease: Elastic.easeOut, immediateRender: false }, i );

                }

                var sx = 0;
                var sc = 0;

                var tracks = _.keys( Volumes );
                var totalTracks = tracks.length;
                tracks.splice( tracks.indexOf( 'dennis drums' ), 1 );
                tracks.splice( tracks.indexOf( 'dennis supersaw' ), 1 );
                tracks.splice( tracks.indexOf( 'dennis 8-Drum Rack' ), 1 );
                tracks.splice( tracks.indexOf( 'dennis elephant' ), 1 );

                if ( MEDIUM || LITE ) {
                    tracks.splice( tracks.indexOf( 'dennis supersaw-1' ), 1 );
                    tracks.splice( tracks.indexOf( 'dennis supersawmono2' ), 1 );
                    tracks.splice( tracks.indexOf( 'dennis BELLS' ), 1 );

                }

                Volume.forPeaks( tracks, this.in, Time.bbd( 41 ), 
                    function( time, info ) {
                        


                        if ( time < 1.5.beats ) { 
                            return;
                        }

                        var pair = this.next();
                        pair.position.x = time * this.timeScale;
                        pair.rotation.x = HALF_PI;
                        pair.sparkle = 1;
                        pair.scale.set( 3, 3, 3 );
                        pair.position.z = map( info.trackIndex, 0, totalTracks - 1, this.minZ, this.maxZ );
                        // console.log( pair.position.z );

                        sx += pair.position.x;
                        sc++;

                        pair.male.visible = true;
                        pair.female.visible = false;
                        pair.male.position.z = 0;

                        time += 0.1;

                        var jump = this.behavior( JumpBehavior );
                        jump.target = pair;
                        this.timeline.fromTo( pair.scale, random( 0.05, 0.1 ), { z: 0.1 }, { z: 2, ease: Elastic.easeOut, immediateRender: false }, time );
                        this.timeline.fromTo( pair.position, 0.3, { y: 0 }, { y: -40, ease: Elastic.easeOut, immediateRender: false }, time );

                        jump.duration = Time.div( random( 4, 8 ) );
                        this.timeline.call( jump.start, [], jump, Math.max( time - jump.duration, 0 ) );



                    }, this );

                floor.position.x = sx / sc;
                floor.scale.set( 3, 3, 3 );

            },
            update: function() {
                Pair.sparkleSeed.value.y -= 0.01;
                // this.camera.position.x = ( this.now ) * this.timeScale;

                floor.time.y += 0.003;


                // console.log( Player.now, this.throbFrequency );
                this.throb = ~~( ( Player.now + ( window.number || 0 ) ) / this.throbFrequency );
                if ( this.throb > this.lastThrob) {
                    floor.time.y += 0.1;
                    this.throbTimeline.restart();
                }

                this.lastThrob = this.throb;
            } 
        } 
    );
        
    var JumpBehavior = Composition( 
        Behavior,
        function() {
            this.height = random( 0, 800 );
            this.origin = new THREE.Vector3();
        },
        {
            start: function() {
                this.d = this.duration - ( 2 * this.height ) / ( G * this.duration );
                this.c = ( - G * this.d / 2 - Math.sqrt( G * G * this.d * this.d / 4 + 2 * G * this.height ) ) / -G;
                this.origin.copy( this.target.female.position );
                // this.origin.y = 0;
                this.y = random.range( 200, 300 );
                this.x = random.range( 200, 300 );
                this.rx = random( TWO_PI * 4 );
            },

            update: function() {
                this.target.female.visible = true;
                this.target.female.position.x = map( this.now, 0, this.duration, this.origin.x + this.x, this.origin.x );               
                this.target.female.position.z = ( G * this.now - G * this.c ) / 2 * ( this.d + this.now - this.c );
                this.target.female.position.y = map( this.now, 0, this.duration, this.origin.y + this.y, this.origin.y );               
                this.target.female.rotation.x = map( this.now, 0, this.duration, this.rx, HALF_PI );               
            },
            stop: function() {
                this.target.female.position.set( 0, 0, 0 );
                this.target.female.rotation.set( 0, 0, 0 );
            } 
        }
    )

} )( this );
;( function( scope ) {

    var far = 28000;

    scope.RainShot = Composition( 

        PairShot,

        { 
            cuts: {
                kicks: [ -157.247, 7.456, 346.318, -0.0057, -0.0601, -0.0003, -0.0028, -0.03, -0.0001, 0.9995, 60, 1, far ],
                past: [ 275.4952, 140.8028, 148.6545, -1.1314, 1.3097, 1.118, -0.0877, 0.6614, 0.0783, 0.7408, 60, 1, far ],
                hihats: [ 122.7725, 167.0485, 150.9345, -0.5543, 0.6051, 0.3386, -0.2092, 0.3265, 0.0743, 0.9188, 60, 1, far ],
                forward: [ -375.0855, 324.505, 252.1986, -0.9347, -0.6841, -0.7078, -0.2943, -0.428, -0.1497, 0.8413, 60, 1, far ],
                underneath: [ 83.4989, -220.4249, 153.1916, 0.9634, 0.4645, -0.5726, 0.3749, 0.323, -0.1412, 0.8574, 60, 1, far ],
                pokes: [ 204.7161, 192.1022, 386.8859, -0.2049, 0.6512, 0.1253, -0.0768, 0.3237, 0.0264, 0.9427, 60, 1, far ]
            }
        },

        function() {
            
            this.trackEvents = {};

            this.tracks = [];
            this.pairs = [];

            this.cameraContainer = new Group();
            this.cameraContainer.add( this.camera );

            this.camera.unserialize( [ -316.0056, 648.9662, -58.4661, 1.7585, -1.0886, 1.782, 0.1574, -0.7201, 0.1736, 0.6532, 60, 1, far ] );

            this.targetThreshold = 0.5;
            
            this.camera.distance = 200;

            this.throbFrequency = 2.0.beats;

        },

        {
 
            start: function() {

                this.camera.add( bg );

                Pair.setFogDistance( far );

                var throbTimeline = new TimelineLite( { paused: true } );
                var throbAttack = 0.3;
                var ta = 0.5;
                var tb = 0.55;
                throbTimeline.fromTo( floor, this.throbFrequency / 2 * ( throbAttack ), { threshhold: ta }, { threshhold: tb, ease: Elastic.easeOut } );
                throbTimeline.fromTo( floor, this.throbFrequency / 2 * ( throbAttack ), { threshhold: tb }, { threshhold: ta, ease: Elastic.easeOut }, this.throbFrequency / 2 );
                this.throbTimeline = throbTimeline;
                // this.timeline.add( throbTimeline );

                var d = bg.colorHigh;
                var c = 0xffffff;
                this.timeline.add( bg.wipe( 0.25.bars, c ), 0.0 );
                this.timeline.call( function(){
                    bg.visible = false;
                }, [], this, 2.5.bars );
                
                floor.reset();
                floor.colorHigh = c;
                floor.colorLow = 0xeeeeee;
                floor.opacityHigh = 0;
                floor.position.x = 4000;
                this.container.add( floor );

                this.timeline.fromTo( floor.scale, 2.0.div, { x: 0.01, y: 0.01, z: 0.01 }, { x: 1.2, y: 1.0, z: 1.2, ease: Back.easeOut }, 5.0.div );

                this.camera.distanceEasing = 1.0;
                this.pairs.clear();
                this.trackSpacing = 80;
                this.timeSpacing = 300;

                this.tracks.forEach( function( name ) { 
                    this.trackEvents[ name ] = Volumes[ name ].peaksBetween( this.in, this.max );
                }.bind( this ) );
 
                var trackIndex = 0;
                var numTracks = _.keys( this.trackEvents ).length;

                this.cameraIntro = this.behavior( CameraTween );
                this.cameraIntro.target = this.camera;
                this.cameraIntro.easing = Easing.Quadratic.Out;
                this.cameraIntro.origin = [ -2442.3067, 1415.9202, 1257.6282, -1.3666, -0.3604, -1.04, -0.47, -0.4293, -0.2809, 0.7183, 60, 1, far ];
                this.cameraIntro.dest = [ -316.7992, 156.7858, -58.3562, -1.6909, -1.2003, -1.6995, -0.1262, -0.7112, -0.1322, 0.6788, 60, 1, far ];
                this.cameraIntro.duration = 5;
                
                this.cameraIntro.in = this.in;
                this.cameraIntro.start();


                var shake = this.behavior( Shake );
                shake.magnitude.set( 0, 6, 0 );
                shake.target = this.camera;

                this.timeline.call( this.fall, [], this, Time.bars( 20.125 ) - this.in );
                this.timeline.call( shake.start, [], shake, Time.bars( 20 ) - this.in );
                this.timeline.call( shake.stop, [], shake, Time.bars( 20, 2 ) - this.in );


                this.yeaPair = this.next();
                this.yeaPair.position.z = -100;

                this.camera.passenger.add( this.yeaPair );
                this.timeline.add( this.yeaPair.jump(), Time.bbd( 17, 3, 0, 120 ) - Time.seconds( 0.3 ) - this.in );


                var massivePair;
                var maxX = 0;

                var massiveImpactTime = Time.bbd( 19, 3, 3 ) - this.in;


                _.each( this.trackEvents, function( trackEvents, trackName ) { 
 
                    var color = Pair.maleColors.next();

                    trackEvents.forEach( function( time, i ) { 

                        time -= this.in;

                        pair = this.next();

                        this.pairs.push( pair );

                        pair.explode = this.behavior( ExplodeBehavior );
                        pair.explode.target = pair;
                        
                        pair.fallBehavior = this.behavior( FallBehavior );
                        pair.fallBehavior.target = pair;
                        // pair.fallBehavior.s = 0.1;

                        pair.rotation.x = -Math.PI / 2;
                        pair.position.x = time * this.timeSpacing; 
                        pair.position.z = ( trackIndex - ~~( numTracks / 2 ) ) * this.trackSpacing;

                        if ( pair.position.x > maxX ) {
                            maxX = pair.position.x;
                        }

                        var maleScale = 1;

                        if ( trackName == 'dennis drums' && i == trackEvents.length - 1 ) {

                            maleScale = 12;
                            pair.male.scale.set( maleScale, maleScale, maleScale );
                            pair.male.position.z = 1800;

                            massivePair = pair;

                        }

                        var pp = pair;

                        // this.timeline.call( function() {
                            // floor.time.y += random( 0.01, 0.05 );
                        // },[], this, time - 0.2 );
                        // this.timeline.add( floor.splat( 0.5.div ), time );

                        var impactTime = time - Time.seconds( 0.4 );

                        var raiseDuration = 2.0.beats;
                        var raisePause = ( HANDHELD ? 3.0.beats : 2.0.bars );
                        var t = impactTime - raiseDuration - raisePause;

                        var ot = impactTime + ( HANDHELD ? 0.5.beats : 2.0.bars );

                        var fallDuration = HANDHELD ? 0.5.beats : 1.0.bars;

                        if ( HANDHELD && ot > 0 && pp !== massivePair ) { 

                            this.timeline.to( pair.position, fallDuration, { 
                                y: -30000, 
                                ease: Quint.easeIn
                            }, ot );


                        }

                        if ( t > 0 ) {

                            pair.visible = false;
                            this.timeline.set( pair, { visible: true }, t );
                            this.timeline.from( pair.female.position, raiseDuration, { 
                                z: -8000, 
                                ease: Quint.easeOut
                            }, t );

                            this.timeline.from( pair.male.position, raiseDuration, { 
                                z: 8000, 
                                ease: Quint.easeOut
                            }, t );


                        }

                        this.timeline.add( pair.insert( 2.0, maleScale ), impactTime );
                        // this.timeline.call( Renderer.setClearColor, [ pair.maleColor, 1 ], Renderer, time ); // why not?

                    }.bind( this ) );

                    trackIndex++;

                }, this );

                ExplodeBehavior.Rate = 12.5;

                this.pairs.forEach( function( pair ) { 
                    
                    pair.explode.center = massivePair.position;
                    pair.explode.decay = 0.3;
                    
                    pair.explode.offset.y += Math.sin( ( massivePair.position.x - pair.position.x ) / 200 ) * 500 / Math.max( 0.1, Math.abs( massivePair.position.x - pair.position.x ) / 500 );

                    this.timeline.$( massiveImpactTime, pair.explode.start, pair.explode );
                    this.timeline.$( massiveImpactTime, pair.explode.speed2.setLength, pair.explode.speed2, 2 );

                }, this );

                massivePair.male.visible = false;
                this.timeline.set( massivePair.male, { visible: true }, massiveImpactTime - Time.beats( 2 ) );
                this.timeline.set( massivePair.female, { visible: false }, massiveImpactTime );

                var impactZoom = this.behavior( CameraTween );
                impactZoom.dest = new Camera();
                impactZoom.dest.unserialize( [ 7818.298,178.208,394.3921,-0.1877,0.4107,0.1751,-0.0737,0.2103,0.1042,0.9693,94,1,far ] );
                impactZoom.target = this.camera;
                impactZoom.easing = Easing.Exponential.Out;
                impactZoom.duration = 2.0.beats;

                this.timeline.$( Time.bbd( 20 ) - 1.2.div - this.in, this.camera.toWorld, this.camera );
                this.timeline.$( Time.bbd( 20 ) - 1.2.div - this.in, impactZoom.start, impactZoom );

                var tween2 = this.behavior( CameraTween );
                tween2.target = this.camera;
                tween2.duration = 50.0.div;
                tween2.dest = new Camera()
                tween2.dest.unserialize( 7922.264,227.6843,633.0721,-0.1878,0.4108,0.3375,-0.0564,0.2156,0.1825,0.9576,94,1,far );

                // this.timeline.$( Time.bbd( 20 ) - this.in, tween2.start, tween2 );

                var center = new THREE.Vector3( maxX / 3, 0, 0 );

                var shuff = new Shuffler( this.pairs );
                var hideBox = new THREE.Box3();
                var hideBoxSize = new THREE.Vector3( 1, 1, 1 ).setLength( 2000 );
                var hidden = [];

                var backDistance = 200;
                var maleDistance = 550;
                
                massivePair.marked = true;

                var cameraImpact = function( time, insert, shakeDur, jumperTimes, jumpPositions, quicky ) {

                    var _this = this;

                    time -= this.in;

                    var pair;

                    do { 
                        pair = shuff.next();  
                    } while ( pair.marked );

                    pair.marked = true;

                    var dest = new Camera();
                    var tween = this.behavior( CameraTween );
                    var rot = { x: random.angle() / 8, y: random.angle() / 8, z: random.angle() / 8 };
                    
                    var shake = this.behavior( Shake );
                    shake.target = dest;
                    shake.duration = shakeDur || 4.0.div;


                    dest.distance = !quicky ? this.camera.distance : 50;

                    var handheld = this.behavior( HandheldBehavior );
                    handheld.target = dest;
                    handheld.magnitude.set( 100, 100, 0 );
                    pair.add( dest );
                    
                    tween.target = this.camera;
                    tween.dest = dest;
                    tween.duration = 1.0.div;
                    tween.easing = Easing.Quadratic.In;

                    var b = 0.5.div;
                    var d = tween.duration + b;

                    reset( pair );

                    // this.timeline.$( this.camera, { distance: dest.position.z } );

                    this.timeline.$( time - b, shake.start, shake );
                    this.timeline.$( time - b, function() {

                        floor.visible = false;

                        bg.visible = true;

                        bg.colorHigh = Pair.maleColors.next();
                        bg.colorLow = 0xffffff;
                        bg.scale.set( 0.6, 0.6, 0.6 )
                        bg.randomize();
                        if ( quicky ) {
                            bg.noiseScale = 6.0;
                        } else { 
                            bg.noiseScale = 4.0;
                        }


                        dest.add( bg );

                    } );

                    this.timeline.$( time - b + shake.duration, function() {

                        if ( !quicky ) bg.visible = false;

                        // if ( !quicky ) {
                            pair.fallBehavior.stop();
                            pair.explode.stop();
                        // }

                    } );

                    // this.timeline.$( time - b, Renderer.setClearColor, Renderer, 0x000000, 1 );
                    // this.timeline.$( time - b + shake.duration - 0.05, Renderer.setClearColor, Renderer, 0xffffff, 1 );
                    // this.timeline.$( time - b + shake.duration - 0.05, handheld.start, handheld );

                    this.timeline.$( time - d, function() {

                        // this.cameraTarget = null;
                        // Scene.camera = this.camera;
                        pair.male.visible = true;
                        pair.male.position.z = maleDistance;
                        pair.visible = true;   

                        hideBox.setFromCenterAndSize( pair.position, hideBoxSize );

                        for ( var i = 0, l = this.pairs.length; i < l; i++ ) { 
                            var p = this.pairs[ i ];
                            if ( p === pair ) continue;
                            if ( HANDHELD || hideBox.containsPoint( p.position ) ) {
                                p.visible = false;
                            }
                        }



                    }, this );

                    this.timeline.$( time - d, tween.start, tween );


                    this.timeline.$( time - b, function() {
                        Scene.camera = dest;
                        this.cameraTarget = dest;

                        if ( !HANDHELD ) {
                            for ( var i = 0, l = hidden.length; i < l; i++ ) { 
                                hidden[ i ].visible = true;
                            }
                        }
                        hidden.length = 0;
                    }, this );


                    if ( insert !== false ) {
                        this.timeline.add( pair.insert3( 0.6 ), time );
                        // this.timeline.to( dest.position, 0.25.div, { z: backDistance, ease: Back.easeOut }, time + shake.duration - 2.0.div );
                    } else { 

                    }

                    jumperTimes = jumperTimes || [];

                    var roffset = random.angle();
                    var x, y;

                    var sx = 0;
                    var sy = 0;

                    jumperTimes.forEach( function( j, jj ) {
                        
                        var jumper = shuff.next();
                        while ( jumper === pair || jumper.marked ) {
                            jumper = shuff.next();
                        }

                        jumper.marked = true;

                        reset( jumper );
                        var rr = random( 90, 120 );
                        var a = roffset + random.range( 0.2 ) + jj * ( Math.PI * 2 / jumperTimes.length );

                        x = jumpPositions[ jj * 2 ];
                        y = jumpPositions[ jj * 2 + 1 ];

                        var tx = x + random.range( 20 );
                        var rx = random.range( 0.2, 0.4 );
                        var ty = y + random.range( 20 );
                        var tz = random( -20, -30 );
                        sx += x;
                        sy += y;

                        this.timeline.$( time - b, function() {
                            jumper.explode.stop();
                            jumper.fallBehavior.stop();
                            
                            jumper.reset();
                            jumper.visible = true;
                            pair.add( jumper );

                            _.defer( function() {
                                jumper.male.visible = true;
                                jumper.male.position.z = maleDistance;
                                jumper.rotation.set( rx, random.range( 0.2, 0.4 ), random.range( 0.2, 0.4 ) );
                                jumper.position.x = tx;
                                jumper.position.y = ty;
                                jumper.position.z  = tz;
                                // jumper.female.position.y = insert ? -300 : -900;
                                jumper.position.z = 0;
                            } );
                            
                            // console.log( jumper );

                        } );
                        var l = 0.65.div;
                        this.timeline.add( jumper.insert( 1.0 ), time + j - 2.5.div );
                        // this.timeline.to( jumper.female.position, l / 2.0, { y: 0, ease: Quad.easeOut }, time + j - 1.5.div ); 
                        this.timeline.to( jumper.position, 2.0.beats, { z: tz - 5.0, ease: Expo.easeOut }, time + j - 1.0.div ); 
                        // this.timeline.to( jumper.rotation, 1.5.beats, { x: rx - random.sign() * random( 0.5, 4.0 ), ease: Expo.easeOut }, time + j - 0.2.div ); 
                        // if ( insert ) this.timeline.to( dest.position, l / 2.0, { x: x, y: y, ease: Quad.easeOut }, time + j - 1.0.div );

                    }, this )

                    // this.timeline.to( dest.position, 0.25.div, { x: sx / ( jumperTimes.length + 1 ), z: this.camera.distance, y: sy / ( jumperTimes.length + 1 ), ease: Quint.easeOut }, time + shake.duration - 1.0.div );
                    dest.position.x = sx / ( jumperTimes.length + 1 )
                    dest.position.z = dest.distance;//this.camera.distance
                    dest.position.y = sy / ( jumperTimes.length + 1 );

                    function reset( pair ) { 

                        _this.timeline.set( pair.male.position, { z: maleDistance }, time - d );
                        // _this.timeline.set( pair.male.rotation, rot, time - d );
                        // _this.timeline.set( pair.female.rotation, rot, time - d );

                    }

                }.bind( this );

                cameraImpact( Time.bbd( 20, 2 ), true, 4.0.div, [ 
                    Time.bbd( 0, 0, 1 ) + 0.9.beats, 
                    Time.bbd( 0, 0, 2 ) + 0.9.beats
                ], [
                    90, 45, 180, -45
                ]);

                cameraImpact( Time.bbd( 21, 0 ), true, 4.0.div, [ 
                    Time.bbd( 0, 0, 1 ) + 0.9.beats, 
                    Time.bbd( 0, 0, 2 ) + 0.9.beats
                ], [
                    90, 45, 180, 90
                ] );

                var fourScale = 0.7;

                cameraImpact( Time.bbd( 21, 2 ), false, 2.0.div, [ 
                    Time.bbd( 0, 0, 0 ) + 0.55.beats, 
                    Time.bbd( 0, 0, 1 ) + 0.55.beats, 
                    Time.bbd( 0, 0, 2 ) + 0.55.beats, 
                    Time.bbd( 0, 0, 3 ) + 0.55.beats, 
                ], [
                    90 * fourScale, 45 * fourScale, 
                    180 * fourScale, 90 * fourScale,
                    270 * fourScale, 135 * fourScale, 
                    360 * fourScale, 180 * fourScale
                ] );

                cameraImpact( Time.bbd( 22, 0 ), true, 4.0.div, [ 
                    Time.bbd( 0, 0, 1 ) + 0.9.beats, 
                    Time.bbd( 0, 0, 2 ) + 0.9.beats
                ], [
                    90, -45, 180, -90
                ]  ); 

                cameraImpact( Time.bbd( 22, 2 ), false, 4.0.div, [], [], true );
                cameraImpact( Time.bbd( 22, 3 ), false, 4.0.div, [], [], true );
                cameraImpact( Time.bbd( 23, 0 ), true, 4.0.div, [], [], true );
                cameraImpact( Time.bbd( 23, 2 ), false, 4.0.div, [], [], true );

            },

            fall: function() {

                this.pairs.forEach( function( pair ) { 
                    pair.fallBehavior.start();
                }.bind( this ) );

            },

            update: function() {

                if ( Player.now < Time.bars( 20 ) ) {
                    this.cameraContainer.position.x = this.now * this.timeSpacing;
                } 

                if ( this.cameraTarget ) {
                    this.camera.copy( this.cameraTarget );
                }

                // if ( Player.now > Time.bbd( 19, 3, 3 ) ) {
                    
                //     Controls.object._targetDistance = this.postRainDistance;
                //     // console.log( this.postRainDistance );
                // } else { 
                //     Controls.object._targetDistance = 200;

                // }

                floor.time.y += 0.003;


                // console.log( Player.now, this.throbFrequency );
                this.throb = ~~( ( Player.now + ( window.number || 0 ) ) / this.throbFrequency );
                if ( this.throb > this.lastThrob) {
                    // this.throbTimeline.restart();
                }

                this.lastThrob = this.throb;
                // console.log( this.throb, this.lastThrob );

                // floor.threshhold += ( this.targetThreshold - floor.threshhold ) * 0.01;


            }

        } 

    );
        
} )( this );

;( function( scope ) {
    
    var LiftBehavior = Composition( 

        Behavior, 

        function() {
            this.speed = random( 50, 250 ) * 1.5;
        }, 

        {
            start: function() {
                this.origin = this.target.position.y;
                this.rx = this.target.rotation.x;
                this.ry = this.target.rotation.y;
            },
            update: function() {
                this.target.rotation.x = lerp( this.rx, HALF_PI, Easing.Quadratic.InOut( clamp( this.now / Time.bars( 0.33 ) , 0, 1 ) ) );
                this.target.position.y = Easing.Quadratic.In( this.now / this.duration ) * ( this.speed * this.duration ) + this.origin;
            } 
        }

    )

    var DropBehavior = Composition( 

        Behavior,

        function() {
            this.speed = 800;
        },

        {

            start: function() {
                Group.prototype.toWorld.call( this.target.male );
                this.origin = this.target.position.y;
                this.len = this.origin / this.speed;

            },
            update: function() {
                var t = cmap( this.now, 0, this.len, 0, 1 );
                t = Easing.Quadratic.In( t );
                this.target.male.position.y = lerp( this.target.position.y, 0, t );
            } 


        }

    )

    var LaunchBehavior = Composition( 

        Behavior,

        function() {
            this.speed = random( 3000, 6000 );
        },

        {

            start: function() {
                this.origin = this.target.position.y;       
            },
            update: function() {
                this.target.position.y = this.origin + this.now * this.speed;
            }
        }
    )

    scope.RefuseShot = Composition( 

        PairShot,

        function() {

            this.count = 100;
            this.camera.fov = 90;
            this.camera.y = 300;
            this.dir = -1;

        },

        {
            
            start: function() {

                this.pairs = [];
                this.course = [];

                var seed = random( 200 );
                var speed = 10;
                var x = 0;
                var z = 0;
                var i = 0;

                floor.reset();
                Renderer.setClearColor( 0x000000, 1 );
                floor.colorHigh = 0x000000;
                floor.colorLow = 0x222222;
                this.container.add( floor );

                this.duration = Time.frames( this.count ) * 10;

                var shake = this.behavior( Shake );
                shake.magnitude.set( 0, 9, 0 );
                shake.target = this.camera;
                shake.duration = this.duration - Time.bars( 0.5 );

                this.timeline.call( shake.start, [], shake, 1.0.bars );

                for ( var now = 0, inc = Time.frames( 10 ); now < this.duration; now += inc ) {
                    var angle = noise( x * 0.006, z * 0.002, seed ) * 4 * TWO_PI;
                    x -= Math.sin( angle ) * speed * 2 ;
                    z -= Math.abs( Math.cos( angle ) * speed );
                    y = 0;
                    this.course.push( [ x, y, z, angle ] );
                }

                for ( var i = 0; i < this.count; i++ ) {
                    var pair = this.next();
                    var pos = this.getPos( Time.frames( i ) );
                    pair.position.set( pos[ 0 ] + random.range( 100 ), pos[ 1 ], pos[ 2 ] + random.range( 100 ) );
                    pair.rotation.reorder( 'YXZ' )
                    pair.rotation.y = random.range( PI );
                    pair.rotation.x += random.range( 0.3 );

                    pair.male.visible = true;
                    pair.male.position.set( 0, 0, 0 );

                    var lift = this.behavior( LiftBehavior );
                    lift.duration = Time.bars( 3 );
                    lift.target = pair;

                    var center = i == ~~( this.count / 7 );

                    this.timeline.call( lift.start, [], lift, random( 0, Time.beats( 2 ) ) );

                    if ( i == 0 ) {
                        this.camera.position.set( pos[ 0 ], 0, pos[ 2 ] + 150 );
                    }
                    if ( center ) {
                        this.center = pair;
                    }

                    this.pairs.push( pair );

                }

                this.pairs = _.shuffle( this.pairs );

                var j = 0;
                for ( var i = Time.bars( 0.5 ); i < Time.bars( 3 ); i += Time.div( 0.125 / 1.5 ) ) {

                        if ( j >= this.pairs.length ) {
                            break;
                        }
                        var pair = this.pairs[ j++ ];
                        pair.drop = this.behavior( DropBehavior );
                        pair.drop.target = pair;
                        this.timeline.call( pair.drop.start, [], pair.drop, i + 1.0.beats );

                        pair.launch = this.behavior( LaunchBehavior );
                        pair.launch.target = pair;
                        pair.maleLaunch = this.behavior( LaunchBehavior );
                        pair.maleLaunch.target = pair.male;;
                        
                        this.timeline.call( pair.launch.start, [], pair.launch, i + Time.bars( 1 ) );
                        this.timeline.call( pair.maleLaunch.start, [], pair.drop, i + Time.bars( 1 ) );

                }

                var lockCamera = function() {
                    this.camera.position.copy( this.center.position );
                    this.camera.position.z += 200;
                    this.camera.position.x += 200;
                    this.camera.position.y = 0;
                    this.update();
                };



                this.timeline.call( this.camera.unserialize, [[637.0572,-27.2998,-150.3776,0.3725,0.6159,0,0.1765,0.2978,-0.0561,0.9365,90,1,30000]], this.camera, Time.bars( 1 ) );
                this.timeline.call( lockCamera, [], this, Time.bars( 1 ) );



            },

            getPos: function( time ) {
                return this.course[ ~~( Time.to.frames( time ) ) ];
            },

            update: function() {
                // this.dir = ~~Time.to.frames( this.now ) % 2 == 0 ? -1 : 1;
                this.camera.lookAt( this.center.position );
                // this.camera.position.y += 8 * this.dir * clamp( this.now / Time.bars( 2 ), 0, 1 );
                        
            } 

        } 

    );
        
} )( this );

;( function( scope ) {
    
    scope.SexyShot = Composition( 

        PairShot,

        function() {
            this.camera.position.z = 80;
            this.camera.distance = this.camera.position.z;
            this.distance = 1;
            this.ry = random.sign() * ( HALF_PI - HALF_PI / 1.5 );
            this.rx = random.range( HALF_PI / 2 );
            this.camera.thetaRange = PI;
        },

        {
            
            start: function() {
                this.pair = this.next();
                this.pair.rotation.set( this.rx, this.ry, 0 );

                // bg.colorHigh = this.pair.colorMale;
                // this.pair.rotation.z = random.range( HALF_PI / 2 );
                this.pair.male.visible = true;
                this.update();
                // this.pair.visible = false;

                if ( this.credit ) {
                    this.container.add( creditNHX );
                    creditNHX.position.z = -10;
                    creditNHX.position.y = 20;
                    creditNHX.position.x = 45.5;
                    creditNHX.scale.setLength( 0.12 );
                }

                if ( this.background ) {

                    bg.visible = false;
                    Renderer.setClearColor( this.pair.colorMale, 1 );

                }

                
            },

            update: function() {


                var t = this.now / this.len;

                this.pair.male.position.z = map( t, 0, 1, 50 * this.distance, 0 );
                this.pair.male.rotation.z = map( t, 0, 0.7, HALF_PI / 3 * this.distance, 0 );

                this.pair.female.position.z = map( t, 0, 1, -50 * this.distance, 0 );
                this.pair.rotation.z = map( t, 0, 1, -HALF_PI / 3 * this.distance, 0 );

            } 

        } 

    );

} )( this );

;( function( scope ) {
    
    scope.SnakeShot = Composition( 

        PairShot,

        function() {
            this.camera.fov = 90;
            this.rollStrength = 10;
            this.camera.rotation.reorder( 'YXZ' );
            this.camera.thetaRange = PI;
            this.camera.phiRange = PI;
            this.cameraContainer = new THREE.Object3D();
            this.container.add( this.cameraContainer );
            this.cameraContainer.add( this.camera );
            this.camera.distance = 150;
            this.camera.position.z = 0;
        },

        {
            
            start: function() {
                
                floor.reset();
                floor.colorHigh = Pair.maleColors.next();
                floor.colorLow = Pair.maleColors.next();
                this.container.add( floor );
                Renderer.setClearColor( floor.colorHigh, 1 );

                floor.scale.set( 2.0, 2.0, 2.0 );

                this.course = [];

                var seed = random( 200 );
                var speed = 10;
                var x = 0;
                var z = 0;
                var i = 0;

                for ( var now = 0, inc = Time.frames( 1 ); now < this.duration + 1.0.bars; now += inc ) {
                    var angle = noise( x * 0.0002, z * 0.0002, seed ) * 4 * TWO_PI;
                    x += Math.sin( angle ) * speed;
                    z += Math.cos( angle ) * speed;
                    y = angle;
                    this.course.push( [ x, y, z, angle ] );
                }
                    var _this = this;

                Volume.forPeaks( this.tracks, this.in, this.out, 
                    function( time, info ) {
                        

                        var vol = Volumes[ info.track ].at( time );
                        var offset = 0.5.div;// map( vol, 0, 1, 0, Time.div( 1 ) );

                        var pos = this.getPos(  time + offset  );
                        var pair = this.next( { colorMale: Pair.maleColors[ info.trackIndex % Pair.maleColors ] } );
                        
                        var r = info.noteIndex * ( TWO_PI * 0.01 );
                        var d = random.range( 30, 80 );

                        if ( !pos ) return;

                        pair.position.x = pos[ 0 ];
                        pair.position.y = pos[ 1 ];
                        pair.position.z = pos[ 2 ];
                        pair.rotation.x = r + PI;

                        if ( info.trackNoteIndex == info.trackTotal - 1 && info.track == 'dennis pokey' ) {
                            this.camera.add( pair );
                            pair.position.set( 0, 0, -100 );
                            pair.rotation.set( 0, random.range( 0.2 ), random.range( 0.2 ) );
                            this.timeline.$( time, function() {
                                floor.visible = false;
                                Renderer.setClearColor( 0x000000, 1 );
                                _this.freezeCamera = true;
                            } );

                        } else {
                            pair.position.x -= Math.cos( pos[ 3 ] + r ) * d;
                            pair.position.y -= Math.sin( pos[ 3 ] + r ) * d / STAGE_ASPECT_RATIO;
                        }

                        // console.log( info.noteIndex, info.total,info.trackNoteIndex, info.trackTotal );

                        pair.visible = false;
                        this.timeline.set( pair, { visible: true }, time - 0.1 );

                        var y = pair.position.y ;

                        this.timeline.fromTo( pair.position, 0.1, { y: -300 + y }, { y: y, ease: Expo.easeInOut, immediateRender: false }, time - 0.1 )
                            .to( pair.position, 0.5, { y: 2 + y, ease: Linear.easeNone }, time ) 
                            .to( pair.position, 0.5, { y: -1000, ease: Expo.easeIn }, time + 0.3 );

                        this.timeline.add( pair.insert( 1.8 ), time - 0.2 );

                    }, this );

            },

            getPos: function( time ) {
              
                return this.course[ ~~( Time.to.frames( time ) ) ];

            },

            update: function() {

                var t = Math.max( 0, this.now + Time.div( 2 ) );

                var pos = this.getPos( t );
                var prev = this.getPos( t - Time.frames( 1 ) );

                if ( !pos || this.freezeCamera ) return;

                this.cameraContainer.position.x = pos[ 0 ];
                this.cameraContainer.position.y = pos[ 1 ];
                this.cameraContainer.position.z = pos[ 2 ];
                this.cameraContainer.rotation.y = pos[ 3 ];


                if ( prev) {
                    this.cameraContainer.rotation.z += ( this.rollStrength * ( pos[ 3 ] - prev[ 3 ] ) - this.cameraContainer.rotation.z ) * 0.1 ;
                //     // this.camera.rotation.x = Math.atan2( pos[ 1 ] - prev[ 1 ], pos[ 0 ] - prev[ 0 ] );

                }

            } 

        } 

    );
        
} )( this );

;( function( scope ) {
    
    var SwirlBehavior = Composition( 
        Behavior,
        function() {
        
            this.radius = random( 10, 50 );
            this.verticalSpeed = 1.2
            this.angleSpeed = lerp( 0.0001, 0.02, this.radius / 50 );
            this.seed = random( 0.5, 2 );
            // this.rx = random.range( 0.02, 1.4 );
            // this.ry = random.range( 0.02, 1.4 );

        },
        {

            start: function() {
            }, 
            update: function() {
                var angle = ( this.n * 2 - ( this.now * 0.7 + 18 ) * this.angleSpeed + 0.3 ) % 3;
                this.target.position.x = ( angle ) * 240 + 60;
                this.target.position.y = this.radius * Math.sin( -angle * TWO_PI );
                this.target.position.z = this.radius * Math.cos ( -angle * TWO_PI) ;
                // this.target.rotation.x = this.now * this.rx;
                // this.target.rotation.y = this.now * this.ry;
            }

        } 
    ); 

    var ThrobBehavior = Composition( 
    
        Behavior,
    
        function() {
            this.amplitude = random( 0.5, 2 );
            // this.duration = random( 5, 40 ).div;
        },
    
        {
            update: function() {
                var t = Easing.Elastic.Out( this.now / 2 );
                var a = ( 1 - t ) * this.amplitude;
                var d = ( this.origin + a - this.target.scale.x ) * 0.23;
                d = clamp( d, -0.15, 0.15 );
                var v = this.target.scale.x + d;
                this.target.scale.set( v, v, v );
            }
        }
    
    );


    scope.SwirlShot = Composition( 

        {
            Count: 1,
        },

        PairShot,

        function() {
            this.container.add( creditAAF );
            this.container.add( creditPopcorn );
            
            creditAAF.scale.setLength( 0.425 );
            creditAAF.position.x = -125;

            creditPopcorn.rotation.y = HALF_PI
            creditPopcorn.scale.setLength( 3 );
            creditPopcorn.position.z = -850;
        }, 

        {
            start: function() {

                bg.position.y = 0;
                bg.updateMatrix();
                this.camera.add( bg );
                
                this.camera.thetaRange = PI * 0.25;
                this.camera.phiRange = PI * 0.5;
                this.lookAt = undefined;

                this.hero1 = this.next();
                this.heroGroup1 = new PairWrapper( this.hero1 );
                this.heroGroup1.position.copy( { x: 158.4396, y: -25.7578, z: -22.0123 } );
                this.heroGroup1.rotation.y = Math.PI * 0.5;
                this.heroGroup1.rotation.y += random.range( 0.15, 0.25 ) * Math.PI;
                this.heroGroup1.rotation.x = random.range( 0.15, 0.25 ) * Math.PI;
                this.heroGroup1.visible = false;
                this.heroGroup1.scale.set( 0.4, 0.4, 0.4 );

                this.hero2 = this.next();
                this.heroGroup2 = new PairWrapper( this.hero2 );
                this.heroGroup2.position.z = -30;
                this.heroGroup2.rotation.y = random.range( 0.1, 0.15 ) * Math.PI;
                // this.heroGroup2.rotation.x = random.range( 0.15, 0.25 ) * Math.PI;
                this.heroGroup2.visible = false;
                this.heroGroup2.scale.set( 0.4, 0.4, 0.4 );


                // Impact 1
                // -------------------------------  



                Player.timeline.set( this.heroGroup1, { visible: true }, 32.0.beats );
                Player.timeline.to( this.heroGroup1.position, 0.75, { x: this.heroGroup1.position.x - 2, ease: Linear.easeNone }, 32.75.beats );
                Player.timeline.to( this.hero1.rotation, 0.75, { x: 0.15, ease: Linear.easeNone }, 32.75.beats );
                Player.timeline.add( this.hero1.insert(), 32.75.beats - Time.seconds( 0.4 ) );
                Player.timeline.add( bg.curdle( new THREE.Color( 0xffffff ), this.hero1.colorMale ), 32.75.beats )

                Player.timeline.call( this.explode, [], this, 32.75.beats );

                Player.timeline.call( this.setExplodeSpeed, [ 800 ], this, 33.5.beats );
                // Player.timeline.call( Renderer.setClearColor, [ 0xffffff, 1 ], Renderer, 33.5.beats );
                Player.timeline.to( this.hero1.position, Time.seconds( 6 ), { z: -8000, ease: Linear.easeNone }, 33.5.beats );
                Player.timeline.to( this.hero1.rotation, Time.seconds( 6 ), { x: 480, ease: Linear.easeNone }, 33.5.beats );

                Player.timeline.call( this.setExplodeSpeed, [ 200 ], this, 34.5.beats );


                Player.timeline.set( this.heroGroup2, { visible: true }, 35.8.beats );
                Player.timeline.fromTo( this.hero2.position, 0.5.beats, { z: -20000 }, { z: 0, ease: Linear.easeNone }, 35.5.beats );
                Player.timeline.fromTo( this.hero2.rotation, 0.5.beats, { x: 100 }, { x: 0, ease: Linear.easeNone }, 35.5.beats );


                // Impact 2
                // ------------------------------- 
                Player.timeline.call( this.setExplodeSpeed, [ 20 ], this, 36.0.beats );
                Player.timeline.to( this.hero2.position, 0.75, { z: 4, ease: Linear.easeNone }, 36.0.beats );
                Player.timeline.to( this.hero2.rotation, 0.75, { x: 0.25, ease: Linear.easeNone }, 36.0.beats );

                Player.timeline.add( this.hero2.insert(), 36.75.beats - Time.seconds( 0.4 ) );
                // Player.timeline.$( function() {
                    
                // }, [], this, 36.75.beats )
                Player.timeline.add( bg.curdle( new THREE.Color( 0xffffff ), this.hero2.colorMale ), 36.75.beats )
                // Player.timeline.$( 36.75.beats, bg.curdle, bg, { r: 1, g: 1, b: 1 }, this.hero2.colorMale )
                // Player.timeline.call( Renderer.setClearColor, [ this.hero2.colorMale, 1 ], Renderer, 36.75.beats );
                // Player.timeline.$( 36.75.beats, bg.colorLow, { x: 1, y: 1, z: 1 } );
                // Player.timeline.$( 36.75.beats, bg.colorHigh, { x: 0, y: 0, z: 0 } );
                // Player.timeline.$( 36.75.beats, bg, { threshhold: 0.5 } );

                Player.timeline.to( this.hero2.position, 0.75, { z: -8, ease: Linear.easeNone }, 36.75.beats );
                Player.timeline.to( this.hero2.rotation, 0.75, { x: -0.5, ease: Linear.easeNone }, 36.75.beats );

                Player.timeline.call( Renderer.setClearColor, [ 0xffffff, 1 ], Renderer, 37.5.beats );
                Player.timeline.to( this.hero2.position, 6, { z: -8000, ease: Linear.easeNone }, 37.5.beats );
                Player.timeline.to( this.hero2.rotation, 6, { x: -480, ease: Linear.easeNone }, 37.5.beats );


                this.popCount = 0;

                ExplodeBehavior.Rate = 1;

                this.heroGroup2.visible = false; 
                this.heroGroup1.visible = false;
                
                Scene.add( this.heroGroup1 );
                this.camera.add( this.heroGroup2 );

                this.pairs = this.get( PairPool.size / 4 );

                this.poppers = [];
                this.sploders = [];
                this.drifts = [];

                this.pairs.forEach( function( pair, n ) {

                    pair.male.matrixAutoUpdate = false;
                    pair.female.matrixAutoUpdate = false;

                    pair.rotation.x = random.angle();
                    pair.rotation.y = random.angle();
                    pair.rotation.z = random.angle(); 
                    var popper = n % 2 === 0;

                    var s = random( 0.09, 0.15 ) * 1.35;
                    pair.scale.set( s, s, s )
                
                    var behavior = this.behavior( SwirlBehavior );
                    this.drifts.push( behavior );
                    behavior.n = n / this.pairs.length;
                    behavior.target = pair;
                    behavior.start();
                    behavior.update();
                    
                    var behavior = this.behavior( ExplodeBehavior );
                    behavior.target = pair;
                    behavior.center = this.heroGroup1.position;
                    this.sploders.push( behavior );
                    
                    var behavior = this.behavior( HonkBehavior );
                    behavior.target = pair;
                    behavior.start();
                    pair.strokeInflate( 1 / s * 0.35 );

                    if ( popper ) {
                        var behavior = this.behavior( PairJiggle );
                        behavior.target = pair;
                        behavior.amplitude = 2;
                        behavior.scale = s;
                        pair.scale.set( s, s, s )
                        pair.visible = false;
                        this.poppers.unshift( behavior );
                    }

                    var throb = this.behavior( ThrobBehavior );
                    throb.target = pair;
                    throb.origin = pair.scale.x;
                    pair.throb = throb;                        

                }, this );

                this.poppers = _.shuffle( this.poppers );

                Midi.query( { type: 'noteOn', track: 3 } ).forEach( function( note ) { 

                    if ( note.time < this.in ) return;

                    var time = note.time - this.in;

                    // this.timeline.$( time, bg.splat, bg, 1.0.beats );
                    // this.timeline.$( time, bg.colorHigh, bg, Pair.maleColors.next() );
                    // this.timeline.$( time, bg.uniforms.colorHigh.value, { x: 0, y: 0, z : 0 } );

                    this.pairs.forEach( function( pair, i ) { 

                        if ( !pair.throb ) return;

                        this.timeline.$( time + i / this.pairs.length * 1.0.div, pair.throb.start, pair.throb );

                    }, this );

                }, this );

                Midi.query( { type: 'noteOn', track: 2 } ).forEach( function( note ) { 

                    if ( note.time < this.in ) return;
                    
                    for ( var i = 0; i < 2; i ++ ) {

                        var b = this.poppers[ this.popCount++ % this.poppers.length ];
                        this.timeline.$( note.time - this.in, b.start );
                    }

                }, this );

            },
            update: function() {
                
                // bg.time.x += 0.01 * 0.125;
                // bg.time.y += 0.001 * 0.125;

                if ( this.lookAt ) {
                    this.camera.lookAt( this[ this.lookAt ].position );
                    // this.camera.distance = this.camera.distanceTo( this[ this.lookAt ].position );
                }

            },
            explode: function() {

                this.setExplodeSpeed( 80 );
                this.sploders.forEach( function( behavior ) {
                    behavior.start();
                } )

            },
            setExplodeSpeed: function( s ) {

                this.sploders.forEach( function( behavior ) {
                    behavior.speed2.setLength( s );
                } );

            },
            freeze: function() {

                this.drifts.forEach( function( d ) {
                    d.stop();
                } );

            },
            stop: function() {
                this.poppers.clear();
            } 
        }

    )


} )( this );
;( function( scope ) {
    
    scope.TableTurnShot = Composition( 

        PairShot,

        function() {
            this.camera.unserialize( -15.7036,-6.1413,80.4846,-0.1467,-0.6351,0,-0.0696,-0.3114,-0.0229,0.9474,60,1,30000 );
            this.camera.distance = this.camera.position.length();

            this.swarmDepth = 10000;
            this.swarmContainer = new THREE.Object3D();
            this.swarmContainer.position.z = -this.swarmDepth / 3;

            this.camera.thetaRange = 0.5;
            this.camera.phiRange = 0.5;
            this.camera.distance = 0;

            this.container.add( this.swarmContainer );

        }, 

        { 
             
            start: function() {


                this.superSparkle = false;

                SwarmBehavior.Rate = 1;
                this.swarmContainer.visible = true;

                Renderer.setClearColor( 0x000000, 1 );
                bg.reset();
                this.camera.add( bg );
                bg.visible = true;
                bg.noiseScale = 2;
                bg.colorLow = 0xffffff;
                bg.colorHigh = 0x000000;


                bg.threshhold = 1;
                bg.time.set( 0, 0, 0 );
                if ( LITE_PERLIN ) {
                    bg.scale.setLength( 0.45 );
                }

                this.decoy = this.next();

                this.decoy.female.visible = true;
                this.decoy.male.visible = true;
                
                this.timeline.fromTo( this.decoy.male.position, Time.bbd( 0, 0, 2 ), { z: 400 }, { z: 40, immediateRender: false, ease: Linear.easeNone }, Time.div( 0 ) );
                this.timeline.fromTo( this.decoy.male.position, Time.bbd( 0, 4 ), { z: 40 }, { z: 34, immediateRender: false, ease: Linear.easeNone }, Time.bbd( 0, 0, 2 ) );
                
                this.timeline.$( 2.0.div, function() {
                    SwarmBehavior.Rate = 0.002;
                } );

                this.timeline.to( this.decoy, Time.bbd( 0, 1, 2 ) * 2, { sparkle: 1, ease: Linear.easeNone }, Time.bbd( 0, 1, 2 ) );
                
                this.camera1 = new Camera();
                this.camera1.unserialize( -66.7461,14.5528,73.8503,-0.1725,-0.8826,-0.0001,-0.0779,-0.4255,-0.0368,0.9008,60,1,30000  );
                this.camera1.distance = this.camera1.position.length();
                this.camera1.lookAt( this.decoy.position );

                this.camera2 = new Camera();
                this.camera2.unserialize( -3.1921,62.2693,88.457,-0.874,-0.0104,-0.0002,-0.4232,-0.0047,-0.0023,0.906,60,1,30000  );
                this.camera2.distance = this.camera2.position.length();
                // this.camera2.lookAt( this.decoy.position );

                // this.timeline.$( Time.bbd( 0, 1, 2 ), function() {
                //     Controls.centerOffsetInstant();
                //     Scene.camera = this.camera1;
                // }.bind( this ) )

                // this.timeline.$( Time.bbd( 0, 1, 2 ) * 2, function() {
                //     // Scene.camera = this.camera2;
                // }.bind( this ) )

                this.timeline.call( this.camera.unserialize, [-66.7461,14.5528,73.8503,-0.1725,-0.8826,-0.0001,-0.0779,-0.4255,-0.0368,0.9008,60,1,30000], this.camera, Time.bbd( 0, 1, 2 ) );
                this.timeline.call( this.camera.unserialize, [-3.1921,62.2693,88.457,-0.874,-0.0104,-0.0002,-0.4232,-0.0047,-0.0023,0.906,60,1,30000], this.camera, Time.bbd( 0, 1, 2 ) * 2 );

                var shake = this.behavior( Shake );
                shake.target = this.camera;
                shake.magnitude.set( 5, 0, 0 );
                shake.duration = Time.div( 5 );

                this.sis = this.next();
                this.sis.visible = false;
                this.sis.sparkle = 1;

                this.timeline.fromTo( this.sis.rotation, Time.div( 1 ), { z: TWO_PI * 8 }, { z: 0, ease: Linear.easeNone, immediateRender: false }, Time.bbd( 0, 3, 3 ) )
                this.timeline.fromTo( this.sis.position, Time.div( 1 ), { x: -505, y: 0, z: 36 }, { x: -10, y: 0, z: 36, ease: Linear.easeNone, immediateRender: false }, Time.bbd( 0, 3, 3 ) )
                this.timeline.set( this.sis, { visible: true }, Time.bbd( 0, 3, 3 ) )

                this.timeline.to( this.decoy.male.rotation, Time.bbd( 0, 1, 2 ), { y: 0.5, ease: Linear.easeNone }, Time.bbd( 0, 4 ) )
                this.timeline.to( this.decoy.male.position, Time.bbd( 0, 1, 2 ), { x: 40, ease: Linear.easeNone }, Time.bbd( 0, 4 ) )

                this.timeline.to( this.sis.rotation, Time.bbd( 0, 1, 2 ), { z: 0.2, ease: Linear.easeNone, immediateRender: false }, Time.bbd( 0, 4 ) )
                this.timeline.to( this.sis.position, Time.bbd( 0, 1, 2 ), { x: -26, ease: Linear.easeNone }, Time.bbd( 0, 4 ) )

                this.timeline.fromTo( this.sis.scale, Time.bbd( 0, 1, 2 ), { x: 0.1 }, { x: 1, ease: Elastic.easeOut, immediateRender: false }, Time.bbd( 0, 4 ) )
                this.timeline.fromTo( this.decoy.male.scale, Time.bbd( 0, 2 ), { x: 0.1 }, { x: 1, ease: Elastic.easeOut, immediateRender: false }, Time.bbd( 0, 4 ) )

                this.timeline.call( shake.start, [], shake, Time.bbd( 0, 4 ) );
                
                this.timeline.call( this.camera.unserialize, [-6.3611,-5.2826,43.4969,-0.0797,-1.5701,-0.0003,-0.0281,-0.7063,-0.0283,0.7068,60,1,30000], this.camera, Time.bbd( 0, 5, 0 ) )
                this.timeline.call( function() {
                    this.swarmContainer.visible = false;
                }, [], this, 5.0.beats );
                this.timeline.to( bg, 4.0.beats, { threshhold: 0.6, ease: Linear.easeNone }, 3.0.beats );
                this.timeline.to( bg, 0.5.beats, { noiseScale: 6, ease: Expo.easeOut }, 7.0.beats );
                
                if ( LITE_PERLIN ) this.timeline.to( bg.time, 2.0.beats, { z: 20, ease: Linear.easeOut }, 7.0.beats );
                else this.timeline.to( bg.time, 2.0.beats, { x: 20, ease: Linear.easeOut }, 7.0.beats );

                this.timeline.to( this.decoy.male.rotation, Time.bbd( 0, 2 ), { y: TWO_PI * 20 - HALF_PI, ease: Linear.easeNone }, Time.bbd( 0, 5 ) )
                this.timeline.to( this.decoy.male.position, Time.bbd( 0, 2 ), { x: 1000, ease: Linear.easeNone }, Time.bbd( 0, 5 ) )

                var intercept = function() {

                    this.decoy.female.rotation.set( 0, -HALF_PI, 0 );
                    this.decoy.female.scale.set( 30, 30, 30 );
                    this.decoy.sparkle = 1;
                };


                var shake2 = this.behavior( Shake );
                shake2.target = this.decoy;
                shake2.magnitude.set( 0, 30, 0 );
                shake2.duration = Time.div( 4 );

                this.timeline.call( intercept, [], this, Time.bbd( 0, 6 ) );
                this.timeline.fromTo( this.decoy.female.position, Time.div( 0.2 ), { x: 1000, y: -300, z: 0 }, { y: -30, ease: Linear.easeNone, immediateRender: false }, Time.bbd( 0, 6 ) );
                this.timeline.fromTo( this.decoy.female.rotation, Time.div( 0.2 ), { z: random( QUARTER_PI, HALF_PI ) }, { z: 0.1, ease: Linear.easeNone, immediateRender: false }, Time.bbd( 0, 6 ) );
                this.timeline.to( this.decoy.female.position, Time.div( 8 ), { y: 0, ease: Linear.easeNone }, Time.bbd( 0, 6, 0.2 ) );
                this.timeline.to( this.decoy.female.rotation, Time.div( 8 ), { z: 0, ease: Linear.easeNone }, Time.bbd( 0, 6, 0.2 ) );

                this.timeline.call( shake2.start, [], shake2, Time.bbd( 0, 7 ) );
                this.timeline.set( this, { superSparkle: true }, Time.bbd( 0, 7 ) );

                // this.timeline.call( Renderer.setClearColor, [ this.decoy.colorMale, 1 ], Renderer, Time.bbd( 0, 7 ) )
                this.timeline.set( this.decoy, { visible: false }, Time.bbd( 0, 7 ) )
                this.timeline.set( this.decoy.male, { visible: false }, Time.bbd( 0, 7 ) )

                this.timeline.set( this.decoy, { visible: true }, Time.bbd( 0, 7 ) + Time.frames( 3 ) )

                // var catchup = function() {
                //     console.log( this );

                //     var tween = this.behavior( CameraTween );
                //     tween.target = this.camera;
                //     tween.dest = new Camera();
                //     tween.dest.position.copy( this.decoy.male.position );
                //     tween.dest.position.x -= 40;
                //     tween.origin = this.camera;
                //     tween.duration = Time.div( 5 );
                //     tween.start();


                // }.bind( this );

                // this.timeline.call( catchup, [], this, Time.bbd( 0, 6 ) );

                this.swarmPairs = this.get( 125 );
                this.swarmPairs.forEach( function( p ) {
                    this.swarmContainer.add( p );
                    var b = this.behavior( SwarmBehavior );
                    b.depth = this.swarmDepth;
                    b.target = p;
                    // p.swarmBehavior = b
                    // p.swarmBehavior.start();                    
                    b.start();
                }, this );
            },

            update: function() {

                // if ( this.superSparkle ) {
                    Pair.sparkleSeed.value.y -= 0.01;
                // }
                // Pair.sparkleSeed.value.w += 0.01;
            } 

        } 

    );
        
} )( this );

;( function( scope ) {
    
    scope.TestShot = Composition( 

        PairShot,

        function() {
            this.camera.position.z = 200;
            this.camera.position.x = 5 * 50 / 2;
            this.camera.position.y = 3 * 50 / 2;
        },

        {
            
            start: function() {


                for ( var i = 0; i < 24; i++ ) { 
                    var pair = this.next();
                    pair.position.x = i % 6 * 50;
                    pair.position.y = ~~( i / 6 ) * 50;
                    pair.male.visible = i % 2 === 0;
                    pair.male.position.set( 0, 0, 0 );
                }

                // this.pair1.male.visible = true;
                // this.pair1.male.position.set( 0, 0, 0 );
                // this.pair2 = this.next();

            },

            update: function() {
                // var s = Math.sin( Date.now() * 0.0005 );
                // this.pair1.rotation.x += 0.01;
                // this.pair1.rotation.x += 0.01;
                // this.pair1.position.x = s * 50;

                // this.pair1.sparkle = s * 0.5 + 0.5;

            } 

        } 

    );
        
} )( this );

//# sourceMappingURL=maps/build.js.map