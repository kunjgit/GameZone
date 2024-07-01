/* 
 * RIFFWAVE.js v0.03 - Audio encoder for HTML5 <audio> elements.
 * Copyleft 2011 by Pedro Ladaria <pedro.ladaria at Gmail dot com>
 *
 * Public Domain
 *
 * Changelog:
 *
 * 0.01 - First release
 * 0.02 - New faster base64 encoding
 * 0.03 - Support for 16bit samples
 *
 * Notes:
 *
 * 8 bit data is unsigned: 0..255
 * 16 bit data is signed: �?32,768..32,767
 *
 */

var FastBase64 = {

    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encLookup: [],

    Init: function() {
        for (var i=0; i<4096; i++) {
            this.encLookup[i] = this.chars[i >> 6] + this.chars[i & 0x3F];
        }
    },

    Encode: function(src) {
        var len = src.length;
        var dst = '';
        var i = 0;
        while (len > 2) {
            n = (src[i] << 16) | (src[i+1]<<8) | src[i+2];
            dst+= this.encLookup[n >> 12] + this.encLookup[n & 0xFFF];
            len-= 3;
            i+= 3;
        }
        if (len > 0) {
            var n1= (src[i] & 0xFC) >> 2;
            var n2= (src[i] & 0x03) << 4;
            if (len > 1) n2 |= (src[++i] & 0xF0) >> 4;
            dst+= this.chars[n1];
            dst+= this.chars[n2];
            if (len == 2) {
                var n3= (src[i++] & 0x0F) << 2;
                n3 |= (src[i] & 0xC0) >> 6;
                dst+= this.chars[n3];
            }
            if (len == 1) dst+= '=';
            dst+= '=';
        }
        return dst;
    } // end Encode

}

var RIFFWAVE = function(data) {

    this.data = [];        // Array containing audio samples
    this.wav = [];         // Array containing the generated wave file
    this.dataURI = '';     // http://en.wikipedia.org/wiki/Data_URI_scheme

    this.header = {                         // OFFS SIZE NOTES
        chunkId      : [0x52,0x49,0x46,0x46], // 0    4    "RIFF" = 0x52494646
        chunkSize    : 0,                     // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
        format       : [0x57,0x41,0x56,0x45], // 8    4    "WAVE" = 0x57415645
        subChunk1Id  : [0x66,0x6d,0x74,0x20], // 12   4    "fmt " = 0x666d7420
        subChunk1Size: 16,                    // 16   4    16 for PCM
        audioFormat  : 1,                     // 20   2    PCM = 1
        numChannels  : 1,                     // 22   2    Mono = 1, Stereo = 2...
        sampleRate   : 8000,                  // 24   4    8000, 44100...
        byteRate     : 0,                     // 28   4    SampleRate*NumChannels*BitsPerSample/8
        blockAlign   : 0,                     // 32   2    NumChannels*BitsPerSample/8
        bitsPerSample: 8,                     // 34   2    8 bits = 8, 16 bits = 16
        subChunk2Id  : [0x64,0x61,0x74,0x61], // 36   4    "data" = 0x64617461
        subChunk2Size: 0                      // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
    };

    function u32ToArray(i) {
        return [i&0xFF, (i>>8)&0xFF, (i>>16)&0xFF, (i>>24)&0xFF];
    }

    function u16ToArray(i) {
        return [i&0xFF, (i>>8)&0xFF];
    }

    function split16bitArray(d) {
        var r = [];
        var j = 0;
        var len = d.length;
        for (var i=0; i<len; i++) {
            r[j++] = d[i] & 0xFF;
            r[j++] = (d[i]>>8) & 0xFF;
        }
        return r;
    }

    this.Make = function(data) {
        if (data instanceof Array) this.data = data;
        this.header.blockAlign = (this.header.numChannels * this.header.bitsPerSample) >> 3;
        this.header.byteRate = this.header.blockAlign * this.sampleRate;
        this.header.subChunk2Size = this.data.length * (this.header.bitsPerSample >> 3);
        this.header.chunkSize = 36 + this.header.subChunk2Size;

        this.wav = this.header.chunkId.concat(
            u32ToArray(this.header.chunkSize),
            this.header.format,
            this.header.subChunk1Id,
            u32ToArray(this.header.subChunk1Size),
            u16ToArray(this.header.audioFormat),
            u16ToArray(this.header.numChannels),
            u32ToArray(this.header.sampleRate),
            u32ToArray(this.header.byteRate),
            u16ToArray(this.header.blockAlign),
            u16ToArray(this.header.bitsPerSample),    
            this.header.subChunk2Id,
            u32ToArray(this.header.subChunk2Size),
            (this.header.bitsPerSample == 16) ? split16bitArray(this.data) : this.data
        );
        this.dataURI = 'data:audio/wav;base64,'+FastBase64.Encode(this.wav);
    };

    if (data instanceof Array) this.Make(data);

}; // end RIFFWAVE

FastBase64.Init();

window.onload = function ()
{
	window.app = {};
	
	app.local_storage = function ()
	{
		return 'localStorage' in window && window['localStorage'] !== null ? true : false;
	}
	
	app.load_cfg = function (name)
	{
		var i = localStorage.getItem(name);
		
		if ( ! app.local_storage || ! i)
		{
			return false;
		}
		
		return JSON.parse(i);
	}
	
	app.save_cfg = function (name, obj)
	{
		if ( ! app.local_storage)
		{
			return false;
		}
		
		localStorage.setItem(name, JSON.stringify(obj));
	}
	
	app.create_cv = function (id, w, h, save, dom)
	{
		var cv = {};

		! app.cv ? app.cv = {} : '';
		
		cv.cv = document.createElement('canvas');
		cv.cv.width = w;
		cv.cv.height = h;
		cv.ctx = cv.cv.getContext('2d');
		
		if (save)
		{
			app.cv[id] = cv;
		}
		
		if (dom)
		{
			document.getElementById('cvs').appendChild(cv.cv);
			cv.cv.setAttribute('width', w);
			cv.cv.setAttribute('height', h);
			cv.cv.setAttribute('id', id);
			cv.cv.setAttribute('class', 'cv');
		}
		
		return cv;
	}
		
	app.init_cv = function (id, create, w, h, save, dom)
	{
		if (create)
		{
			app.create_cv(id, w, h, save, dom)
		} else
		{
			app.cv[id].cv = document.getElementById(id);
			
			if ( ! app.cv[id].cv || ! app.cv[id].cv.getContext)
			{
				return false;
			} else
			{	
				app.cv[id].ctx = app.cv[id].cv.getContext('2d');
			}
		}
	}
	
	app.gen_sfx_data = function (len, fin, fout, fn)
	{
		var data = [];
		var f;
		
		for (var i=0; i<len + fout; i++) {
			if(i >= len) {
				data[i] = 128;
				continue;
			}
			
			f = (i < fin) ? i / fin :
						 ((i >= len - fin) ? 1 - (i - len + fin - 1) / fin : 1);
		
			data[i] = Math.round(128 + fn(i) * f);
		}
		
		return data;
	}
	
	app.gen_audio_elem = function (data)
	{
		var wave = new RIFFWAVE(data); 
		var audio = new Audio(wave.dataURI);
		return audio;
	}
	
	app.play_sfx = function (sfx_name)
	{
		if (app.url_params.sfx == 0)
		{
			return false;
		}
		
		app.sfx[sfx_name].play();
	}
	
	app.fps_tout_fn = function ()
	{
		app.last_fps = app.fps;
		app.fps = 0;
	}
	
	app.grant_achv = function (n, ct, t, i)
	{
		var a = app.achv;
		a[n][0] += i;
		clearTimeout(app[n + '_tout']);
		if (a[n][0] === ct)
		{
			app.toggle_bool(n + '_medal', 3000, true);
			a[n][0] = 0;
			a[n][1] += 1;
			app.play_sfx('exp_1');
		} else
		{
			app.set_timeout(n + '_tout', function () 
			{
				a[n][0] = 0;
			}, t);
		}
	}
	
	app.toggle_bool = function (b, t, v, ctx, c)
	{
		ctx === undefined ? ctx = app : '';
		v === undefined ? v = false : '';
		ctx[b] = v;
		clearTimeout(ctx[b + '_tout']);
		ctx[b + '_tout'] = setTimeout(function ()
		{
			ctx[b] = v ? false : true;
		
			if (c)
			{
				c();
			}
		}, t);
	}
	
	app.set_timeout = function (name, fn, t)
	{
		app[name + '_tout'] = setTimeout(fn, t);
	}
	
	app.init_frnz_assets = function ()
	{
		if (app.url_params.gore === 1)
		{
			app.draw_level(app.cv.frenzy_bg.ctx);
			
			var d = app.cv.frenzy_bg.ctx.getImageData(0, 0, app.w, app.h);
			var dd = d.data;
			var l = dd.length;
			var nd = app.cv.frenzy_bg.ctx.createImageData(app.w, app.h);
			var ndd = nd.data;
				
			for (var a = 0; a < l; a += 4)
			{
				ndd[a] = dd[a];
				ndd[a + 1] = 0;
				ndd[a + 2] = 0;
				ndd[a + 3] = 255;
			}
			
			app.cv.frenzy_bg.ctx.putImageData(nd, 0, 0);
		}
	}
	
	app.init_noise = function ()
	{
		if (app.url_params.noise === 1)
		{
			var pat_cv = app.create_cv('pat_cv', 240, 240);
			var pat_ctx = pat_cv.ctx;
			var alpha;
			var color;
			
			app.noise_frames = [];
			app.crnt_noise_frame = 0;
			app.noise_rate = 0;
			
			for (var a = 0; a < 16; a += 1)
			{
				pat_ctx.clearRect(0, 0, pat_cv.cv.width, pat_cv.cv.height)
				
				for (var r = 0; r < pat_cv.cv.height; r += 6)
				{
					for (var c = 0; c < pat_cv.cv.width; c += 6)
					{
						if (Math.random() < 0.5)
						{
							alpha = Math.random() / 2;
							color = Math.round(Math.random() * 64); 
							pat_ctx.fillStyle = 'rgba(' + Math.round(Math.random() * 30) + ',' + Math.round(Math.random() * 30) + ',' + Math.round(Math.random() * 30) + ',' + alpha + ')';
							pat_ctx.fillRect(c, r, 6, 6);
						}
					}
				}
				app.noise_frames.push(app.cv.noise.ctx.createPattern(pat_cv.cv, 'repeat'));
			}
		}
	}
	
	app.draw_noise = function (ctx)
	{
		if (app.url_params.noise === 1)
		{
			if (app.noise_rate === 1)
			{
				app.noise_rate = 0;
				ctx.clearRect(0, 0, app.w, app.h);
				ctx.fillStyle = app.noise_frames[app.crnt_noise_frame];
				ctx.fillRect(0, 0, app.w, app.h);
				
				app.crnt_noise_frame = app.crnt_noise_frame + 1 === app.noise_frames.length ? 0 : app.crnt_noise_frame + 1;
			} else 
			{
				app.noise_rate+= 1;
			}
		}
	}
	
	app.create_obj = function (o_n, c)
	{
		var id;
		var obj = new app[o_n]();
		
		if (app[obj.type + '_id'].length > 0)
		{
			id = app[obj.type + '_id'].pop();	
		} else
		{
			id = app[obj.type].length;
		}
		
		obj.id = id;
		
		c ? c(obj) : '';
		
		app[obj.type][id] = obj;
		
		return obj;
	}
	
	app.remove_obj = function (o)
	{
		app[o.type + '_id'].push(o.id);
		delete app[o.type][o.id];
	}
	
	app.update_bot_track = function (t, v)
	{
		var b = app.bot_track;
		
		b.spawn[t] += v ? 1 : 0;
		b.kill[t] += v ? 0 : 1;
		b.alive[t] += v ? 1 : -1;
		b.alive_count += v ? 1 : -1;
	}
	
	app.spawn_bot = function (t)
	{
		var bot = app.create_obj('Bot');
		var dir = Math.random() > 0.5 ? 0 : 1;
				
		bot.b_t = t || 0;
		bot.dir = dir;
		bot.dx_max += app.wave * 0.3;
		
		if (Math.random() > 0.7)
		{
			bot.x = Math.random() * app.w;
			bot.y = - bot.h / 2;
		} else
		{
			bot.y = Math.random() * app.h;
			bot.x = - bot.w / 2;
		}
		
		for (var k in app.bot_types[t])
		{
			bot[k] = app.bot_types[t][k];
		}
		
		bot.anim = 'bot_walk_' + app.bot_types[t].skin + '_1';
		app.update_bot_track(t, true);
	}
	
	app.update_player = function ()
	{
		var p = app.plr;
		
		if (p.left || p.right)
		{
			p.anim = 'player_run_' + p.skin;
		} else
		{
			p.anim = 'player_idle_' + p.skin;
		}
		
		p.update_pos();
		p.update_anim_frame();
		p.move();
		p.update_jump();
		p.start_fall();
		p.lvl_pads_coll();
		p.lvl_bnds_coll();
		p.update_phs();
		p.bots_coll();
		p.update_grab();
		p.update_attack();
		p.update_hp();
	}
	
	app.set_screen_shake = function (t, d)
	{
		if ( ! app.shake_tout)
		{
			app.shake = true;
			app.shake_d = d || 2;
			
			clearTimeout(app.shake_tout);
			
			app.shake_tout = setTimeout(function ()
			{
				app.shake = false;
				delete app.shake_tout;
			}, t);
		}
	}
	
	app.action_mngr = function ()
	{
		var t = 0;
		
		if ( ! app.can_spawn || app.wave_break || app.bot_track.alive_count >= app.max_bot_count + Math.min(app.wave_tmr / 15, 10))
		{
			return false;
		}
		
		app.toggle_bool('can_spawn', app.bot_spawn_delay);
		
		if (app.bot_track.alive[0] < Math.max((app.wave / 2.2) - (app.wave / 4) * (app.wave / app.wave_peak), 2) || app.wave < 1)
		{
			t = 0;
		} else
		{
			app.bot_chances.forEach(function (elem, elem_id)
			{
				if (Math.random() < elem)
				{
					t = elem_id + 1;	
				}
			});
		}
		
		app.spawn_bot(t);
	}
	
	app.on_wave_start = function ()
	{
		app.plr.dx_max < 15 ? app.plr.dx_max += 1 : '';
					
		app.max_bot_count = Math.floor(app.wave * app.bot_count_fn[0] + app.bot_count_fn[1]);
		app.bot_spawn_delay = (Math.max(125, 1500 - app.wave * 150));
		
		app.bot_chances_fn.forEach(function (elem, elem_id)
		{
			app.bot_chances[elem_id] = elem[0] * (app.wave / app.wave_peak) + elem[1];
		});
		
		//app.chance_str = 'w:' + (app.wave) + ' x:' + app.max_bot_count + ' r:' + //app.bot_spawn_delay +  ' c:';
		//app.bot_chances.forEach(function (elem)
		//{
		//	app.chance_str += elem.toFixed(2) + '/';
		//});
		app.wave_tmr = 0;
	}
	
	app.update = function ()
	{
		var p = app.plr;
		
		app.fps += 1;
		
		switch (app.game_state)
		{
			case -1:
			{
				break;
			}
			case 0:
			{
				break;
			}
			case 1:
			{
				app.tmr += 0.033;
				app.wave_tmr += 0.033;
		
				app.update_player();
				
				app.bot.forEach(function (bot)
				{
					if (bot.can_move || app.plr.is_grab === false || app.plr.is_grab !== bot.id)
					{
						bot.move();
						bot.lvl_pads_coll();
						bot.lvl_bnds_coll();
						bot.update_phs();
						bot.update_jump();
						bot.update_pos();
						
					} else
					{
						bot.lvl_pads_coll();
					}
					bot.php = bot.hp;
					bot.hp += bot.dhp;
					
					if (bot.dhp < 0)
					{
						bot.sht_p('Blood', bot.x, bot.y, 0, Math.PI * 2, 15, -bot.dhp * (app.plr.frenzy ? 2 : 4), -bot.dhp);
					}
					
					if (bot.hp <= 0)
					{
						if (this.can_move && this.pad_coll === false)
						{
							app.update_hud_msg('aerial killer!!!');
						}
						p.update_kill_ct();
						bot.destroy();
					} else 
					{
						bot.dhp = 0;
					}
					
					if (bot.b_t !== 0)
					{
						bot.anim = bot.anim.slice(0, bot.anim.length - 1) + (Math.random() > 0.5 ? 1 : 2);
					}
					
					bot.update_anim_frame();
				});
				
				app.blood.forEach(function (elem)
				{
					elem.update_phs();
					elem.update_pos();
				});
				
				app.body_part.forEach(function (elem)
				{
					elem.update_phs();
					elem.update_pos();
					elem.lvl_pads_coll();
					elem.update_anim_frame();
				});
				
				if (app.shake === true)
				{
					app.shake_x = -6 * app.shake_d + app.round(Math.random() * 6 * app.shake_d + 6);
					app.shake_y = -6 * app.shake_d + app.round(Math.random() * 6 * app.shake_d + 6);
				} else
				{
					app.shake_x = 0;
					app.shake_y = 0;
				}
				
				if (app.shake)
				{
					app.cvs.style.top = app.shake_y + 'px';
					app.cvs.style.left = app.shake_x + 'px';
				}
				
				app.cv.frenzy_bg.cv.style.zIndex = 1;
				app.cv.frenzy_bg.cv.style.opacity = (app.plr.frenzy ? 3 : 0) * (Math.random() * 0.3 + 0.1);
				
				if (app.plr.frenzy_end !== false)
				{
					app.cv.frenzy_bg.cv.style.opacity = 1;
					app.wave += 1;
					
					app.on_wave_start();
				}
				
				if (app.plr.frenzy && ! app.frenzy_sfx && app.url_params.sfx)
				{
					app.frenzy_sfx = setInterval(function ()
					{
						if (app.plr.frenzy)
						{
							app.play_sfx('frenzy');
						} else
						{
							delete app.frenzy_sfx;
						}
					}, 100);
				}
				
				app.action_mngr();
				
				break;
			}
			case 2:
			{
				if ( ! app.b_sum)
				{
					app.b_sum = [];
					for (var a = 0; a < 4; a += 1)
					{
						app.spawn_bot(a);
						app.b_sum[a] = app.bot[app.bot.length - 1];
						app.b_sum[a].x = 0;
						app.b_sum[a].y = 0;
					}
				} else
				{
					app.bot.forEach(function (elem) {
						elem.update_anim_frame(true);
					});
				}
				
				if ((p.left || p.right || p.jump || p.down) && ! app.summary_menu_select_tout)
				{
					app.select_smr_m(true);
					app.toggle_bool('summary_menu_select_tout', 300, true);
				}
				
				if (app.smr_hvr_y && p.attack && ! app.smr_active_tout)
				{
					app.smr_hvr_x ? app.tweet_score() : app.restart_game();
				}
				
				break;
			}
		}
	}
	
	app.num_to_roman = function (n)
	{
		if (n >= 100)
		{
			return false;
		}
		
		var str = '';
		var substr = '';
		var c;
		var x;
		var i;
		
		x = n >= 10 ? Math.floor(n / 10) : 0;
		n -= x * 10;
		i = n;
		
		var o = {
			'x': x,
			'i': i
		}
		
		if (o.x)
		{
			if (o.x === 10)
			{
				str = 'c';
			} else if (o.x === 9)
			{
				str += 'xc';
			} else
			{
				if (o.x > 5)
				{
					str += 'l';
					o.x -= 5;
				}
				
				if (o.x > 3)
				{
					substr = '';
					o.x -= 3;
					for (var a = 0; a < o.x; a += 1)
					{
						substr = 'x' + substr;
					}
					substr += 'l';
					str += substr;
				} else
				{
					for (var a = 0; a < o.x; a += 1)
					{
						str = 'x' + str;
					}
				}
			}
		}
		
		if (o.i)
		{
			if (o.i === 9)
			{
				str += 'ix';
			} else if (o.i > 4)
			{
				str += 'v';
				o.i -= 5;
				for (var a = 0; a < o.i; a += 1)
				{
					str += 'i';
				}
			} else if (o.i === 4)
			{
				str += 'iv';
			} else
			{
				for (var a = 0; a < o.i; a += 1)
				{
					str += 'i';
				}
			}
		}
		return str;
	}
		
	app.draw_text = function (ctx, txt, x, y, dx, dy, c, roman)
	{
		var l;
		
		txt = txt+'';
		! dx ? dx = 0 : '';
		! dy ? dy = 0 : '';
		c ? c = txt.length * 8 * 6 * (roman ? 4 : 1) / 2 : c = 0;
		
		ctx.save();
		ctx.translate(app.round(x - c), app.round(y));
		
		for (var a = 0; a < txt.length; a += 1)
		{
			l = app.cv['f_' + txt[a] + (roman ? '_roman_big' : '')].cv;
			a > 0 ? ctx.translate(l.width + 6, 0) : '';
			ctx.drawImage(l, app.round(-dx / 2 + Math.random() * dx * 6), app.round(-dy / 2 + Math.random() * dy * 6));
		}
		
		ctx.restore();
	}

	app.draw_hud_msg = function (ctx, dx, dy)
	{	
		if (app.msg.length > 0)
		{
			app.msg.forEach(function (elem, elem_id)
			{
				app.draw_text(ctx, elem, app.round(app.w / 2 - elem.length * 8 * 6 / 2), app.round(app.h / 8) + 12 + elem_id * 6 * 10, dx || 0, dy || 0);
			});
		}
	}
	
	app.reset_game_stngs = function ()
	{
		app.tmr = 0;
		app.wave = 0;
		app.wave_tmr = 0;
		app.wave_break = false;
		app.shake = false;
		app.can_spawn = true;
		
		app.ckill = false;
		app.ckill_pts_buff = 0;
		app.ckill_count = 0;
		app.ckill_max_count = 0;
		app.ckill_max_pts = 0;
		
		app.achv = {
			crusher: [0,0],
			feeder: [0,0],
			grinder: [0,0]
		};
		
		app.bot = [];
		app.bot_id = [];
		app.bot_track = {
			kill: [0,0,0,0],
			spawn: [0,0,0,0],
			alive: [0,0,0,0],
			alive_count: 0
		};
		app.bot_types = [
			{skin: 'normal', dmg: 0, dx_max: 10, hp: 100 },
			{skin: 'green', dmg: 0.47, dx_max: 11, hp: 125 },
			{skin: 'red', dmg: 1.0, dx_max: 12, hp: 150 },
			{skin: 'blue', dmg: 1.50, dx_max: 13, hp: 175 }
		];
		
		app.blood = [];
		app.blood_id = [];
		app.blood_buff = [];
		app.body_part = [];
		app.body_part_id = [];
		
		app.plr = new app.Plr();
		app.plr.x = app.w / 2;
		app.plr.y = app.h / 2;
		
		app.bot_chances = [];
			
	}
	
	app.update_hud_msg = function (msg)
	{
		if (msg !== '')
		{
			app.msg.push(msg);
			
			if (app.msg.length > 1)
			{
				app.msg.shift();
			}
		}
		
		clearTimeout(app.msg_tout);
		
		app.msg_tout = setTimeout(function ()
		{
			if (app.msg.length > 0)
			{
				app.msg.shift();
				app.update_hud_msg('');
			}
		}, 3000);
	}

	app.draw_start_screen = function (ctx)
	{
		ctx.save();
		ctx.translate(0, app.h / 2 - 4 * 6);
		
		app.draw_text(ctx, 'press j to start', app.w / 2, 0, 2, 2, true);
		
		ctx.restore();
	}
	
	app.draw_hud = function (ctx)
	{
		var w = app.w - 60;
		var w3 = app.round(w / 3);
		var w4 = app.round(w / 4);
		
		ctx.save();
		ctx.translate(30, 30);
		
		//heart
		ctx.drawImage(app.cv.h_heart.cv, 0, 0);
		//hp bar
		ctx.fillStyle = app.plr.pdhp && app.plr.pdhp !== 0 && Math.random() > 0.5 ? '#fff' : '#f00';
		ctx.fillRect(11 * 6, 0, app.round((w3 - 15 * 6) * (app.plr.hp / 100)), 6 * 8);
		
		//score
		ctx.translate(w3, 0);
		ctx.drawImage(app.cv.h_score.cv, 0, 0);
		//kill count
		app.draw_text(ctx, Math.floor(app.plr.score * (app.wave + 1)), 10 * 6, 0); 
		
		//skull
		ctx.translate(w3, 0);
		ctx.drawImage(app.cv.h_skull.cv, 0, 0);
		//kill count
		app.draw_text(ctx, Math.floor(app.plr.kill_count), 8 * 6, 0); 
		
		//timer
		ctx.translate(w3 / 2, 0);
		ctx.drawImage(app.cv.h_tmr.cv, 0, 0);
		//time
		app.draw_text(ctx, Math.floor(app.tmr), 10 * 6, 0);
		
		//wave
		//ctx.translate(w4, 0);
		//ctx.drawImage(app.cv.h_wave.cv, 0, 0);
		//app.draw_text(ctx, app.wave + 1, 10 * 6, 0);
		ctx.restore();
		
		//hud message
		app.draw_hud_msg(ctx, 2, 2);
		
		//flicker
		if ( ! app.plr.frenzy)
		{
			if (app.plr.pdhp < -0.36)
			{
				ctx.fillStyle = 'rgba(255,0,0,' + Math.random() / 3 + ')';
			} else
			{
				ctx.fillStyle = 'rgba(0,0,0,' + Math.random() * 0.2 + ')';
			}
		} else
		{
			ctx.fillStyle = 'rgba(' + 255 + ',0,0,' + 0.2 * Math.random() + ')';
		}
		ctx.fillRect(0, 0, app.w, app.h);
		
		//wave info 
		if (app.wave_break)
		{
			ctx.save();
			ctx.translate(0, 80);
			app.draw_text(ctx, 'wave', app.w / 2, app.h / 2 - 190, 2, 2, true);
			app.draw_text(ctx, app.num_to_roman(app.wave + 1), app.w / 2, app.h / 2, 4, 4, true, true);
			ctx.restore();
		} else 
		{
			if (app.plr.frenzy_start)
			{
				//frenzy
				app.draw_text(ctx, 'kill frenzy!!!', app.w / 2, app.h / 2 + 70, 2, 2, true);
			} else if (app.ckill_record_msg)
			{
				//combo
				app.draw_text(ctx, 'combo ' + app.ckill_max_count + ' kills (' + app.ckill_max_pts + 'pts)', app.w / 2, app.h / 2 + 70, 2, 2, true);
			} else if (app.crusher_medal)
			{
				app.draw_achv(ctx, 'crusher');
			}  else if (app.feeder_medal)
			{
				app.draw_achv(ctx, 'feeder');
			} else if (app.grinder_medal)
			{
				app.draw_achv(ctx, 'grinder');
			}
		}	
		
		//fps count
		//app.draw_text(ctx, app.last_fps, app.w - 80, app.h - 50);
	}
	
	app.draw_achv = function (ctx, name)
	{
		app.draw_text(ctx, name + '! (x' + app.achv[name][1] + ')', app.w / 2, app.h / 2 + 70, 2, 2, true);
	}
	
	app.round = function (v, n)
	{
		return v - v % (n || 6);	
	}
	
	app.draw = function (ctx)
	{	
		var p = app.plr;
		var l = app.level;
		var pat;
		
		ctx.fillStyle = '#000';
		ctx.clearRect(0, 0, app.w, app.h);
				
		switch (app.game_state)
		{
			case -1:
			{
				app.draw_start_screen(ctx);
				break;
			}
			case 0:
			{
				app.draw_text(ctx, app.intro_msg[0] + ' (j)', app.w / 2, app.h / 2 - 4 * 6, 2, 2, true);
				break;
			}
			case 1:
			{
				ctx.fillStyle = '#000';
				ctx.clearRect(0, 0, app.w, app.h);
							
				ctx.fillStyle = '#fff';
				//ctx.fillText('pdy: ' + app.plr.dy + ' pdx: ' + app.plr.dx, 10, 10);
				
				//bot
				app.bot.forEach(function (bot)
				{
					ctx.save();
					
					if (bot.dir === 0)
					{
						ctx.scale(-1, 1);	
						ctx.translate(app.round(- 2 * bot.x), 0)
					}
					ctx.translate(app.round(bot.x - bot.sw / 2), app.round(bot.y - bot.sh / 2));
					if ( ! bot.can_move)
					{
						ctx.rotate(3 * Math.PI / 2);
						ctx.translate(-bot.sw, 0);
					}
					
					bot.draw_anim_frame(ctx, 0, 0);
					
					ctx.restore();
				});
				
				//body parts
				app.body_part.forEach(function (elem)
				{
					ctx.save();
					
					if (elem.dir === 0)
					{
						ctx.scale(-1, 1);	
						ctx.translate(app.round(- 2 * elem.x), 0)
					}
					ctx.translate(app.round(elem.x - elem.sw / 2), app.round(elem.y - elem.sh / 2));
					elem.draw_anim_frame(ctx, elem.sw / 2, elem.sh / 2);
					
					ctx.restore();
				});
				
				//blood
				app.blood.forEach(function (elem)
				{
					ctx.fillStyle = 'rgb(' + (128 + Math.floor(Math.random() * 128)) + ', 0, 0)';
					ctx.fillRect(app.round(elem.x), app.round(elem.y), elem.w, elem.h);
				});
				
				//player
				ctx.save();
				
				if (p.dir === 0)
				{
					ctx.scale(-1, 1);	
					ctx.translate(app.round(- 2 * p.x), 0)
				}
				ctx.translate(app.round(p.x - p.sw / 2), app.round(p.y - p.sh / 2));
				
				if (p.frenzy || p.pdhp < -0.9)
				{
					p.anim = p.anim.split('_frenzy_')[0] + ('_frenzy_white_' + (Math.random() > 0.5 ? 1 : 2));
				} else
				{
					p.anim = p.anim.split('_frenzy_')[0] + '_frenzy_white_1';
				}
			
				p.draw_anim_frame(ctx, 0, 0);
				
				ctx.restore();
				
				app.draw_hud(ctx);
				app.draw_gore_fx(app.cv.gore.ctx);
				app.draw_level(app.cv.bg.ctx);
				
				break;
			}
			case 2:
			{
				app.draw_summary(ctx);
				ctx.fillStyle = '#fff';
				
				if (app.smr_hvr_y)
				{
					ctx.fillStyle = 'rgba(255,0,0,' + (0.2 + Math.random() * 0.4) + ')';
					ctx.fillRect(app.smr_hvr_x, app.smr_hvr_y, app.w / 2, 60);
				}
				
				break;
			}
		}
		
		app.draw_noise(app.cv.noise.ctx);
	}
	
	app.draw_level = function (ctx, force)
	{
		var pat;
		var l = app.level;
		//force level to be drawn only once per context
		if (ctx.level_layer && ! force)
		{
			return false;
		} 
		
		ctx.level_layer = true;
		
		ctx.clearRect(0, 0, app.w, app.h);
		
		ctx.save();
		
		//bg
		pat = ctx.createPattern(app.cv.wall_1.cv, 'repeat');
		ctx.fillStyle = pat;
		ctx.fillRect(0, 0, app.w, app.h);
		
		//level pads
		l.pads.forEach(function (pad, pad_id)
		{
			var w = app.round(pad.w);
			var h = l.pad_h;
			
			ctx.save();
			
			ctx.translate(app.round(pad.x), app.round(pad.y));
			pat = ctx.createPattern(app.cv.pad_1.cv, 'repeat');
			
			ctx.fillStyle = '#000';
			ctx.fillRect(6 * 2, 6 * 2, w, h);
			
			for (var a = 0; a < w; a += 6)
			{
				ctx.fillRect(a, h, 1 * 6, Math.floor(Math.random() * 10) * 6); 
			}
			ctx.fillStyle = pat;
			ctx.fillRect(0, 0, w, h);
			
			ctx.restore();
		});
		
		ctx.restore();		
	}
	
	app.draw_gore_fx = function (ctx)
	{	
		if (app.url_params.gore === 1)
		{
			app.blood_buff.forEach(function (elem)
			{
				if (elem.x > 0 && elem.y > 0 && elem.x < app.w && elem.y < app.h && Math.random() < 0.25)
				{
					ctx.drawImage(app.cv.frenzy_bg.cv, app.round(elem.x), app.round(elem.y), 6, 6, app.round(elem.x), app.round(elem.y), 6, 6);
				}
			});
			
			app.blood_buff = [];
		}
	}
	
	app.draw_summary = function (ctx)
	{
		ctx.save();
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, app.w, app.h);
		ctx.translate(app.round(app.w / 2), 30);
		app.draw_text(ctx, 'game over!:(', 0, 0, 2, 2, true);
		
		ctx.translate(0, 120);
		app.draw_text(ctx, 'rank:#' + Math.floor(app.plr.rank) + ' score:' + app.plr.score, 0, 0, 2, 2, true);
		app.draw_text(ctx, 'time:' + Math.floor(app.tmr) + ' wave:' + (app.wave + 1), 0, 60, 2, 2, true);
		app.draw_text(ctx, 'kills:' + app.plr.kill_count, 0, 120, 2, 2, true);
		
		ctx.translate(-app.w / 2, 180);
		if (app.b_sum)
		{
			
			app.b_sum.forEach(function (elem, elem_id)
			{
				ctx.save();
				ctx.translate(elem_id * ((app.w - 60) / 6) + app.w / 4 - 48, 0);
				elem.draw_anim_frame(ctx);
				app.draw_text(ctx, app.bot_track.kill[elem_id], 60, 0, 2, 2);
				ctx.restore()
			});
		}
		
		ctx.translate(app.w / 2, -120);
		app.draw_text(ctx, 'combo ' + app.ckill_max_count + ' kills (' + app.ckill_max_pts + 'pts)', 0, 180, 2, 2, true);
		app.draw_text(ctx, ('crusher:' + app.achv.crusher[1]) + (' feeder:' + app.achv.feeder[1]), 0, 240, 2, 2, true);
		app.draw_text(ctx, ('grinder:' + app.achv.grinder[1]), 0, 300, 2, 2, true);
		
		ctx.translate(0, 120);
		app.draw_text(ctx, 'play again : tweet score', 0, 300, 2, 2, true);
		
		ctx.restore();
	}
	
	app.loop = function ()
	{
		app.update();
		app.draw(app.cv.sucker.ctx);
	}
	
	app.save_h_score = function (score)
	{
		app.h_scores.push(score);
	}
	
	
	app.end_game = function ()
	{
		var r = 1;
		var p = app.plr;
		
		p.score = p.score * (app.wave + 1);
		this.game_state = 2;
		
		app.h_scores.forEach(function (e)
		{
			if (e.score > p.score)
			{
				r += 1;		
			}
		});
		
		p.rank = r;
		
		clearInterval(p.move_sfx);
		clearInterval(p.frenzy_sfx);
		
		if (r === 1)
		{
			app.clr_keys();
			app.smr_hvr_y = 0;
			app.prompt_tout = setTimeout(function ()
			{
				p.name = prompt('New best! Enter your name');
				app.save_h_score({name: p.name || 'unnamed', score: p.score, kills: p.kill_count, kill_types: app.bot_track.kill, time: app.tmr, ckill_max_count: app.ckill_max_count, ckill_max_pts: app.ckill_max_pts, achv: app.achv});
				app.save_cfg('sucker_hs', app.h_scores);
			}, 50);
		}
		
		app.toggle_bool('smr_active_tout', 2000, true, app, app.clr_keys());
	}
	
	app.pause = function ()
	{
		clearInterval(app.loop_interval);
		delete app.loop_interval;	
	}	
	
	app.start = function ()
	{	
		if ( ! app.loop_interval)
		{
			app.loop_interval = setInterval(app.loop, 33);
		}
	}
	
	app.load_sfx = function ()
	{
		app.sfx = {};
		app.sfx_data = {
			footstep_1: {
				fn: function (i) 
				{
					return Math.round(Math.random() * 8)
				},
				d: 400
			},
			footstep_2: {
				fn: function (i) 
				{
					return Math.round(Math.random() * 10);
				},
				d: 400
			},
			footstep_3: {
				fn: function (i) {
					return Math.round(Math.random() * 6);
				},
				d: 400
			},
			hurt: {
				fn: function (i)
				{
					return Math.round(((i/32) % 2 === 0 ? 1 : -1) * 16);
				},
				d: 200
			},
			jump: {
				fn: function (i) 
				{
					return Math.round(Math.cos((Math.PI / 2) * (i / 1200)) * Math.sin(i / (10 - 5 * (i / 1200))) * 32);
				}, 
				d: 1200
			},
			idle_attack: {
				fn: function (i) {
					return Math.round(((Math.sin(i / 1000) > 0 ? 1 : -1) * Math.random() * 2 + Math.sin(i / 128) * 2) * Math.sin((Math.PI * 4 / 800) * i) * 2);
				},
				d: 400
			},
			grab: {
				fn: function (i) {
					return Math.round(Math.sin((i / (32 - 16 * (i / 1000))) * (Math.PI)) * 32 + Math.random() * 2 * Math.sin(Math.PI * (i / 1000) + Math.PI / 6));
				},
				d: 1000
			},
			feed: {
				fn: function (i) {
					return Math.round(Math.sin(Math.PI * (i / 500)) * Math.sin(i / (10 - 5 * (i / 500))) * 32);
				},
				d: 400
			},
			exp_1: {
				fn: function (i) {
					return Math.round(Math.sin((i / (32 - 16 * (i / 4000))) * (Math.PI)) * 32 * Math.sin(Math.PI * (i / (4000 / 5))));
				},
				d: 4000
			},
			pad_hit_1: {
				fn: function (i) {
					return Math.round(Math.sin((Math.PI * 2) * ((i + Math.random()) / (20 + (20 * i / 250)))) * 64 + Math.random() * 4);
				},
				d: 250
			},
			frenzy: {
				fn: function (i) {
					return Math.round(Math.cos(Math.PI / 2 * (i / 1000)) * Math.cos(i / (2 - 1 * (i / 1000))) * 4 + Math.cos(i / 20) * Math.sin(Math.PI * 2 * (i / 1000)) * 64) + Math.round((Math.sin(Math.PI * (i / 1000 / 2)) * Math.sin(i / (10 - 5 * (i / 1000 / 2))) * 32) * Math.sin(Math.PI * 2 * (i / 1000)));
				},
				d: 1000
			}
		}
		
		for (var k in app.sfx_data)
		{
			var a_d = app.gen_sfx_data(app.sfx_data[k].d, 100, 100, app.sfx_data[k].fn);
			app.sfx[k] = app.gen_audio_elem(a_d);
		};
	}
	
	app.restart_game = function ()
	{
		app.game_state = 1;
		app.reset_game_stngs();
		app.on_wave_start();
		app.cv.gore.ctx.clearRect(0,0,app.w,app.h);
	}
	
	app.parse_score = function (s)
	{
		var r = '';
		var l;
		s += '';
		l = s.length;
		
		for (var a = 0; a < l; a += 3)
		{
			r = ',' +s.slice(Math.max(s.length - 3, 0)) + r; 
			s = s.slice(0, Math.max(s.length - 3, 0));
		}
		
		return r.slice(1);
	}
	
	app.tweet_score = function ()
	{
		var l = window.location.href;
		var u = 'https://twitter.com/intent/tweet?hashtags=js13kGames&original_referer=' + l +'&source=tweetbutton&text=I%20scored%20' + app.parse_score(app.plr.score) + '%20points%20over%20' + (app.wave + 1) +'%20wave' + (app.wave > 0 ? 's ' : '') + '%20in%20%22The%20Sucker%22%20game%2C%20a%20js13kGames%20entry%20-%20&url=http%3A%2F%2Fether-wp.com%2Fdistillery%2Fsucker%2F&via=pordesign';
		
		var w = window.open(u, '', 'height=600,width=800');
	}
	
	app.select_smr_m = function (k)
	{
		var p = app.plr;
		
		if (k || app.my > 624 && app.my < 684)
		{
			app.smr_hvr_y = 624;
			app.smr_hvr_x = k ? (app.smr_hvr_x ? 0 : app.w / 2 ) : (app.mx > app.w / 2 ? app.w / 2 : 0);
		}
	}
	
	app.img_from_data = function (d, w_s, h_s)
	{
		var cv;
		var w;
		var h;
		var n = d[0];
		var subtype_n = d[2];
		var img_d = d[1].split(' ');
		var subtypes = subtype_n ? app.gfx_subtypes[subtype_n] : { 'df': 'df' };
		! w_s ? w_s = 1 : '';
		! h_s ? h_s = 1 : '';
		
		w = img_d[0].length * 6 * w_s;
		h = img_d.length * 6 * h_s;
		
		for (var k in subtypes)
		{
			cv = app.create_cv(n + (k !== 'df' ? '_' + k : ''), w, h, true);
			
			img_d.forEach(function (r, r_id)
			{
				var l = r.length;
				
				for (var a = 0; a < l; a += 1)
				{
					cv.ctx.fillStyle = k !== 'df' ? (img_d[r_id][a] === 'e' ? subtypes[k] : app.gfx_pal[img_d[r_id][a]]) : app.gfx_pal[img_d[r_id][a]];
					cv.ctx.fillRect(a * 6 * w_s, r_id * 6 * h_s, 6 * w_s, 6 * h_s);
				}
			});
		}
	}
	
	app.load_gfx = function ()
	{
		app.gfx_subtypes = {
			player: {
				frenzy_white_1: 'rgba(255,255,255,1)', 
				frenzy_white_2: 'rgba(255,0,0,1)'
			},
			bot: {
				normal_1: 'rgba(141,128,101,1)',
				green_1: 'rgba(213,133,18,1)',
				green_2: 'rgba(171,79,24,1)',
				red_1: 'rgba(200,0,0,1)',
				red_2: 'rgba(255,77,33,1)',
				blue_1: 'rgba(40,129,175,1)',
				blue_2: 'rgba(203,89,228,1)'
				
			}
		}
		
		app.gfx_data = [
			['h_heart', '011101110 112111111 121111111 111111111 011111110 001111100 000111000 000010000'],
			['h_vial', '111111 012110 012110 012110 012110 012110 011110 001100'],
			['h_skull', '011110 112111 121111 100100 101101 011011 000010 000110'],
			['h_tmr', '01111110 11211111 12111111 11110001 11101111 11101111 11101111 01111110'],
			['h_wave', '00011010 00210010 00110010 10010210 11110110 00111111 01100100 01001000'],
			['h_score', '00010000 00011000 00121000 11221111 01111110 00111100 01101100 01000100'],
			['f_ ', '00000000'],
			['f_0', '011110 011110 110011 110011 110011 110011 011110 011110'],
			['f_1', '011100 001100 001100 001100 001100 001100 001100 001100'],
			['f_2', '011110 011110 110011 110111 000110 011000 111111 111111'],
			['f_3', '011100 011100 000011 001111 001100 000011 011111 011100'],
			['f_4', '110000 110000 110000 110110 110110 111111 111111 000110'],
			['f_5', '111110 111110 110000 111110 011110 000011 111111 111110'],
			['f_6', '011110 011110 110000 111110 111110 110011 110011 011110'],
			['f_7', '111110 111110 000110 011110 011000 011000 111000 110000'],
			['f_8', '011110 011110 110011 111111 011110 110011 111111 011110'],
			['f_9', '011110 011110 110011 111111 011111 000011 011111 011110'],
			['f_a', '0111110 1110111 1110111 1111111 1110111 1110111 1110111'],
			['f_b', '1111110 1110111 1110111 1111110 1110111 1110111 1111110'],
			['f_c', '0111110 1110111 1110000 1110000 1110000 1110111 0111110'],
			['f_d', '1111110 1110111 1110111 1110111 1110111 1110111 1111110'],
			['f_e', '0111111 1110111 1110000 1111100 1110000 1110111 0111111'],
			['f_f', '0111111 1110111 1110000 1111100 1110000 1110000 1110000'],
			['f_g', '0111110 1110111 1110000 1110111 1110111 1110111 0111110'],
			['f_h', '1110111 1110111 1110111 1111111 1110111 1110111 1110111'],
			['f_i', '1111111 0011100 0011100 0011100 0011100 0011100 1111111'],
			['f_j', '1111111 0000111 0000111 0000111 0000111 1110111 1111110'],
			['f_k', '1110111 1110111 1110111 1111110 1110111 1110111 1110111'],
			['f_l', '1110000 1110000 1110000 1110000 1110000 1110111 0111111'],
			['f_m', '1100011 1110111 1111111 1111111 1110111 1110111 1110111'],
			['f_n', '1111110 1110111 1110111 1110111 1110111 1110111 1110111'],
			['f_o', '0111110 1110111 1110111 1110111 1110111 1110111 0111110'],
			['f_p', '1111110 1110111 1110111 1111110 1110000 1110000 1110000'],
			['f_q', '0111110 1110111 1110111 1110111 1110111 0111110 0000111'],
			['f_r', '1111110 1110111 1110111 1111111 1111110 1110111 1110111'],
			['f_s', '0111111 1110111 1110000 0111110 0000111 1110111 1111110'],
			['f_t', '1111111 0011100 0011100 0011100 0011100 0011100 0011100'],
			['f_u', '1110111 1110111 1110111 1110111 1110111 1110111 0111110'],
			['f_w', '1110111 1110111 1110111 1110111 1111111 1110111 1100011'],
			['f_v', '1110111 1110111 1110111 1110111 1110111 0111110 0011100'],
			['f_x', '1110111 1110111 0111110 0011100 0111110 1110111 1110111'],
			['f_y', '1110111 1110111 1111111 0111111 0000111 1110111 1111110'],
			['f_z', '1111111 1110111 0000111 0111110 1110000 1110111 1111111'],
			['f_!', '0001100 0001100 0001100 0001100 0001100 0000000 0001100'],
			['f_+', '0000000 0001100 0001100 0111111 0001100 0001100 0000000'],
			['f_(', '0001100 0011000 0110000 0110000 0110000 0011000 0001100'],
			['f_)', '0110000 0011000 0001100 0001100 0001100 0011000 0110000'],
			['f_:', '0000000 0000000 0011000 0000000 0000000 0011000 0000000'],
			['f_?', '0011110 0110011 0000011 0000110 0001100 0000000 0001100'], 
			['f_.', '0000000 0000000 0000000 0000000 0000000 0110000 0110000'],
			['f_,', '0000000 0000000 0000000 0000000 0011000 0011000 0110000'],
			['f_\'', '0001100 0000100 0001000 0000000 0000000 0000000 0000000'],
			['f_#', '0000000 0110110 1111111 0110110 0110110 1111111 0110110'],
			['pad_1', '45669459 5789n89n 889n33n3 9n334679 679n6793 9nn39n33'],
			['wall_1', 'bc3i3cci33c3c33c c3c3c3cb3c3i3c33 3i3c3ciic3i3i3i3 c3c3c3cb3c3c3c3c 3c3iccchccc3c3c3 c3c3c3kbbk333i3c 3c33ckbcimm3c3c3 c33icbiccccc3c3c 3ccb3mic3cbllcc3 cmcmlbc33ic33cmc 33cicccmcmb3c3c3 3c33cm3cbb3c333c c3ic33cklc33c33i 3c3c3icbc3c33c33 33i3c3ch3i3i33c3 i33c3ccbc3c3c33c'],
			['player_run', '00000000000000e00000000e0000000000000000e000000000e000 00000e0000000ee0000000ee00000000e000000ee00000000ee000 000eee0e00000ee000000eee000000eee0e0000eee0000000ee000 00eee0e000000ee0000000eee0000e0eee0000eee00000000ee000 0000e00000000e00000000ee0000000ee000000e000000000ee000 000ee00000000ee000000ee0e000000e0000000ee0000000ee0e00 0ee00e000000eee000000e00e00000eee00000eee0000000e00e00 000000e0000000e00000e00e0000ee000e000000e000000e000000 000000e0000000e00000e000000000000e000000e000000e000000', 'player'], 
			['player_idle', '00000000000000e000 00000e0000000e0000 0000e0000000eee000 000eee00000e0e0e00 00e0e0e000000e0000 0000e00000000e0000 000e0e000000e0e000 000e0e000000e0e000 000e00e00000e00e00', 'player'],
			['bot_walk', '000000000000e000000e0000000000e00000 00000e000000e0000000e000000000e00000 0000e0000000e000000eeee0000000e00000 000ee000000eee0000e0e000000000ee0000 000e0e00000ee00000e0e000000000e00000 000e00000000e00000000e00000000e00000 00e0e0000000e00000000ee000000ee00000 00e00e0000000e000000e00000000e0e0000 00000e0000000e000000e00000000e00e000', 'bot'],
			['body_part_1', '0f0000f0000f000f0000e0000e0000e0000e0000f000 0e000e0000e00ee0ee000e0000e00e0000e0f0000e00 0e000e000e00e00000ef00e000e00e00fe000ee000e0 0e00e000e00000000000000f00f0f0000000000e00e0', 'bot'],
			['body_part_2', '0000000000000000 0f0000f000000e00 0e000e000ef000f0 0000000000000000', 'bot'],
			['body_part_3', '0000000000000000 0f000ff00ff000f0 0ff00f0000f00ff0 0000000000000000', 'bot'] 
		];
		
		app.gfx_pal = {
			0: 'rgba(0, 0, 0, 0)',
			
			1: 'rgba(255, 0, 0, 1)',
			2: 'rgba(255, 244, 195, 1)',
			
			3: 'rgba(0, 0, 0, 1)',
			
			4: 'rgba(132, 132, 112, 1)',
			5: 'rgba(114, 115, 100, 1)',
			6: 'rgba(87, 89, 77, 1)',
			7: 'rgba(69, 71, 61, 1)',
			8: 'rgba(50, 50, 40, 1)',
			9: 'rgba(35, 35, 28, 1)',
			
			'b': 'rgba(28, 24, 17, 1)',
			'c': 'rgba(11, 8, 6, 1)',
			'h': 'rgba(35, 33, 28, 1)',
			'i': 'rgba(24, 20, 17, 1)',
			'k': 'rgba(43, 37, 30, 1)',
			'l': 'rgba(23, 20, 16, 1)',
			'm': 'rgba(23, 20, 13, 1)',
			'n': 'rgba(15, 15, 12, 1)',
			
			'e': 'rgba(138, 138, 138, 1)', //anims mostly
			'f': 'rgba(129, 0, 0, 1)' //blood on body parts
		}
		
		app.gfx_data.forEach(function(data)
		{
			app.img_from_data(data);
			
			switch (data[0])
			{
				case 'f_x':
				case 'f_i':
				case 'f_v':
				{
					data[0] += '_roman_big';
					app.img_from_data(data, 4, 4);
					break;
				}
			}
		});
	}
	
	
	app.init_keys = function ()
	{		
		app.kdwn_ct = 0;
		
		window.onkeydown = function (evt)
		{
			if ( ! app.k_pressed || app.k_pressed === false)
			{
				switch (evt.keyCode)
				{
					case 38:
					case 87:
					{
						app.plr.jump = true;
						break;
					}
					case 83:
					case 40:
					case 76:
					case 90:
					case 32:
					{
						app.plr.down = true;
						break;
					}
					case 74:
					case 67:
					{
						app.plr.attack = true;
						break;
					}
					case 37:
					case 65:
					{
						app.plr.left = true;
						break;
					}
					case 39:
					case 68:
					{
						app.plr.right = true;
						break;
					}
					case 88:
					case 75:
					{
						app.plr.grab = true;
						break;
					}
				}
			}
			
			app.kdwn_ct += 1;
		}
		
		window.onkeyup = function (evt)
		{
			switch (evt.keyCode)
			{
				case 38:
				case 87:
				{
					app.plr.jump = false;	
					break;
				}
				case 83:
				case 40:
				case 76:
				case 90:
				case 32:
				{
					app.plr.down = false;
					break;
				}
				case 37:
				case 65:
				{
					app.plr.left = false;
					break;
				}
				case 39:
				case 68:
				{
					app.plr.right = false;
					break;
				}
				case 74:
				case 67:
				{
					if (app.game_state === -1)
					{
						app.game_state = 0;
					} else if (app.game_state === 0)
					{
						app.intro_msg.shift();
						app.play_sfx('jump');
						
						if (app.intro_msg.length === 0)
						{
							app.game_state = 1;
							app.toggle_bool('wave_break', 3000, true);
						}
					}
					
					app.plr.attack = false;
					
					break;
				}
				case 88:
				case 75:
				{
					app.plr.grab = false;
					break;
				}
			}
			
			app.kdwn_ct -= 1;
		}
	}
	
	app.clr_keys = function ()
	{
		var k = ['left', 'right', 'jump', 'down', 'attack', 'grab'];
		k.forEach(function (e)
		{
			app.plr[e] = false;
		});
	}
	
	app.init_mouse = function ()
	{	
		window.onmousemove = function (evt)
		{
			app.prev_mx = app.mx || 0;
			app.prev_my = app.my || 0;
			
			app.mx = evt.pageX;
			app.my = evt.pageY;
			
			app.mxd = app.prev_mx - app.mx;
			app.myd = app.prev_my - app.my;
			
			if (app.game_state === 2)
			{
				app.select_smr_m();
			}
		}
		
		window.onclick = function (evt)
		{
			var p = app.plr;
			if (app.game_state === 2)
			{
				if(app.my > 624 && app.my < 684)
				{
					if (app.mx < app.w / 2)
					{
						app.restart_game();
					} else 
					{
						app.tweet_score();
					}
				}
			}
		}
		
		window.onblur = function ()
		{
			app.clr_keys();
			app.pause();
		}
		
		window.onfocus = function ()
		{
			app.start();
		}
	}
	
	app.update_url = function ()
	{
		var u = window.location.href.split('?')[0] + '?';
		
		for (var k in app.url_params)
		{
			u += k + '=' + app.url_params[k] + '&';
		}
		
		u = u.slice(0, u.length - 1);
		
		window.location.href = u;
	}
	
	app.init_html_menu = function ()
	{
		var options = [
			['sfx', 'sound'], 
			['noise', 'noise'], 
			['gore', 'gore layer']
		];
		
		var b_lvls = 9;
		var b_lvl_sel = document.m.b_lvl;
		
		for (var a = 0; a <= b_lvls; a += 1)
		{
			b_lvl_sel.options[a] = new Option(a + (a === 3 ? ' (default)' : ''), a, false, a === app.url_params.blood_level ? true : false);
		}
		
		options.forEach(function (e)
		{
			var html_elem = document.getElementById('t_' + e[0])
			html_elem.onclick = function ()
			{
				
				if (app.game_state === 1)
				{
					if ( ! confirm('Sure?'))
					{
						return false;
					}
				}
				app.url_params[e[0]] = app.url_params[e[0]] ? 0 : 1;
				html_elem.innerHTML = e[1] + ' ' + (app.url_params[e[0]] == true ? 'on' : 'off');
				app.update_url();
			}
			
			html_elem.innerHTML = e[1] + ' ' + (app.url_params[e[0]] == true ? 'on' : 'off');
		});
		
		b_lvl_sel.onchange = function ()
		{
			app.url_params.blood_level = b_lvl_sel.selectedIndex;
			app.update_url();
		}
		
		document.getElementById('i').innerHTML = 'WSAD/ARROWS - move, J/C - feed, K/X - grab, fall - S/DOWN/SPACE, jump - W/UP';
	}
	
	app.content_loaded = function ()
	{
		return true;
	}
	
	app.update_url_params = function ()
	{
		var p;
		
		app.url_params = {
			sfx: 1,
			noise: 1,
			gore: 1,
			blood_level: 3
		}
		
		if (window.location.href.indexOf('?') !== -1)
		{
			str = window.location.href.split('?')[1].split('&').forEach(function (elem)
			{
				p = elem.split('=');
				
				if (app.url_params[p[0]])
				{
					app.url_params[p[0]] = p[1] * 1 == p[1] ? p[1] * 1 : p[1];
				}
			});
		}
	}
	
	app.load_content = function ()
	{	
		app.load_content_start = true;
		
		app.load_gfx();
		
		if (app.url_params.sfx == 1)
		{
			app.load_sfx();
		}
	}
	
	app.close_overlay = function ()
	{
		document.getElementById('l').style.display = 'none';
	}
	
	app.init_app = function ()
	{
		if ( ! app.load_content_start)
		{	
			app.update_url_params();
			app.init_html_menu();
			app.load_content();
			
			app.l_ct_intrvl = setInterval(function ()
			{
				if (app.content_loaded())
				{
					app.init_app();
					app.close_overlay();
					clearInterval(app.l_ct_intrvl);
				};
			}, 50);	
			
		} else
		{
			app.w = 1278;
			app.h = 720;
			
			app.cv_list = ['bg', 'frenzy_bg', 'gore', 'sucker', 'noise'];
			app.cv_list.forEach(function (elem)
			{
				app.init_cv(elem, true, app.w, app.h, true, true);
			});
			app.cvs = document.getElementById('cvs');
			
			app.init_noise();
			
			app.fps = 0;
			
			app.game_state = -1;
			
			app.ckill_msg = [
				'double',
				'triple',
				'quadruple',
				'quintuple',
				'sextuple',
				'septuple',
				'octuple',
				'nonuple',
				'decuple',
				'undecuple',
				'duodecuple'
			];
			
			app.intro_msg = [
				'hello.. stranger!',
				'your objective..',
				'kill, eat and score!',
			];
			
			app.lp = 120;
			app.level = {
				w: app.w,
				h: app.h,
				pads: [
					{x: (app.w / 9), y: 0, w: (app.w / 9) * 3 - 32},
					{x: (app.w / 9) * 5 + 32, y: 0, w: (app.w / 9) * 3},
					
					{x: -app.lp, y: app.h / 2, w: (app.w / 9) * 2 + app.lp},
					{x: app.w / 3, y: app.h / 2, w: app.w / 3},
					{x: (app.w / 9) * 7, y: app.h / 2, w: (app.w / 9) * 2 + app.lp},
					
					{x: -app.lp, y: app.h - 36, w: (app.w / 9) * 4 + app.lp},
					{x: (app.w / 9) * 5, y: app.h - 36, w: (app.w / 9) * 4 + app.lp}
				],
				pad_h: 36
			}
			
			app.wave_peak = 20;
			app.bot_count_fn = [1, 2];
			app.bot_chances_fn = [
				[0.66, 0.15],
				[0.88, -0.30],
				[1.15, -.75]
			];
			
			app.reset_game_stngs();
			
			app.msg = [];
			
			app.init_keys();
			app.init_mouse();
			
			app.init_frnz_assets();
			
			app.on_wave_start();
			app.start();
			
			app.play_sfx('jump');
			
			app.h_scores = app.load_cfg('sucker_hs') || [];
			
			app.fps_tout = setInterval(app.fps_tout_fn, 1000);
		}
	}
	
	app.Coll_Obj = function ()
	{
		this.x = app.w / 2;
		this.y = app.h / 2;
		this.w = 42;
		this.h = 54;
		this.dx = 0;
		this.dy = 0;
		this.dx_max = 10;
		this.dy_max = 18;
		this.pad_coll = false;
		this.bounce = 0;
		
		return this;
	}
	
	app.Coll_Obj.prototype.proj_out_y = function (pad, pad_id)
	{
		var l = app.level
		var dy = pad.y + l.pad_h / 2 - this.y;
		
		if (dy > 0)
		{
			//over the pad
			this.y = pad.y - this.h / 2;
			this.reload_jump();
			this.pad_coll = pad_id;
			
			if (this.type === 'player' && this.dy >= 18)
			{
				app.play_sfx('pad_hit_1');
				app.set_screen_shake(80 * (this.dy > 36 ? 3 : 1), 2 * (this.dy > 36 ? 2 : 1));
				this.dy > 36 ? this.bot_coll.forEach(function (elem)
				{
					elem.special_kill(1);
				}) : '';
			}
			
			if (this.type === 'bot' && ! this.can_move && app.plr.is_grab.id !== this.id)
			{
				if (this.dy > 26)
				{
					this.special_kill(0);
					app.play_sfx('pad_hit_1');
				} else
				{
					this.can_move = true;
				}
			}
		} else
		{
			//below the pad
			this.y = pad.y + l.pad_h + this.h / 2;
			
			if (this.type === 'bot' && ( ! this.can_move && this.dy < -10))
			{
				this.special_kill(0);
				app.play_sfx('pad_hit_1');
			}
			
			if (this.type === 'player')
			{
				app.play_sfx('pad_hit_1');
				app.set_screen_shake(80);
				this.disable_keep_jump();
			}
		}
		
		//if (this.hp && this.hp > 0 || ! this.hp)
		{
			this.dy = Math.abs(-this.dy * this.bounce) > 2 ? -this.dy * this.bounce : 0;
		}
	}
	
	app.Coll_Obj.prototype.lvl_pads_coll = function ()
	{
		var l = app.level;
		var local_pad_coll = false;
		
		this.pad_coll = false;
		
		px_min = this.x - this.w / 2;
		px_max = this.x + this.w / 2;
		py_min = this.y - this.h / 2;
		py_max = this.y + this.h / 2;
		
		px_min_prev = px_min - this.dx;
		px_max_prev = px_max - this.dx;
		py_min_prev = py_min - this.dy;
		py_max_prev = py_max - this.dy;
		
		l.pads.forEach(function (pad, pad_id)
		{
			var dx;
			var dy;
					
			if (local_pad_coll === true)
			{
				return false;
			}
			
			if (
				(py_min < pad.y && py_max > pad.y || py_min < pad.y + l.pad_h && py_max > pad.y + l.pad_h) && (px_min > pad.x && px_min < pad.x + pad.w || px_max > pad.x && px_max < pad.x + pad.w)
			)
			{	
				if (px_min > pad.x && px_max < pad.x + pad.w)
				{
					//full horizontal contact
					this.proj_out_y(pad, pad_id);
				} else 
				{
					//edge horizontal contact
					if (px_min < pad.x)
					{
						//left edge
						if (px_max_prev <= pad.x)
						{
							if (this.type === 'bot' && this.dx > this.dx_max)
							{
								this.special_kill(0);
							}
							//adjust x if prev x pos was outside of the pad
							this.x = pad.x - this.w / 2;
							this.dx = 0;
						} else
						{
							//if it was over the pad already, adjust y
							this.proj_out_y(pad, pad_id);
						}
						
					} else if (px_max > pad.x + pad.w)
					{
						//right edge
						if (px_min_prev >= pad.x + pad.w)
						{
							if (this.type === 'bot' && this.dx < -this.dx_max)
							{
								this.special_kill(0);
							}
							//adjust x if prev x pos was outside of the pad 
							this.x = pad.x + pad.w + this.w / 2;
							this.dx = 0;
						} else
						{
							//adjust y if prev x pos was inside of the pad
							this.proj_out_y(pad, pad_id);
						}
					}
				}
				
				local_pad_coll = true;
			}	
		}, this);
	}
	
	app.Coll_Obj.prototype.lvl_bnds_coll = function ()
	{
		var p = this;
		var l = app.level;
		
		p.out_of_level_bounds = false;
		
		if (p.x < 0 - p.w / 2)
		{
			p.out_of_level_bounds = true;
			p.x = l.w + p.w / 2;
		} else if (p.x > l.w + p.w / 2)
		{
			p.out_of_level_bounds = true;
			p.x = - p.w / 2;	
		}
		
		if (p.y < 0 + 36)
		{
			p.out_of_level_bounds = true;
			if (p.type === 'player')
			{
				p.y = 36;
				this.disable_keep_jump();
				this.dy = 0;
			}
		} else if (p.y > l.h + p.h / 2)
		{
			p.out_of_level_bounds = true;
			p.y = - p.h / 2;
		}
	}
	
	app.Coll_Obj.prototype.bots_coll = function ()
	{
		this.bot_coll = []
		
		app.bot.forEach(function (bot, bot_id)
		{
			if (
				Math.abs(this.x - bot.x) < this.sw && 
				Math.abs(this.y - bot.y) < this.sh
			)
			{
				this.bot_coll.push(bot);
			}
		}, this);
		
		if ( ! this.is_grab)
		{
			this.b_0 = this.bot_coll[0];
		}
	}
	
	app.Coll_Obj.prototype.start_fall = function ()
	{
		if (this.down === true)
		{
			this.disable_keep_jump();
		}
	}
	
	app.Coll_Obj.prototype.start_jump = function ()
	{
		if (this.jump === true && this.jump_lock === false && this.pad_coll !== false)
		{
			this.jump_lock = true;
			app.play_sfx('jump');
		}
	}
	
	app.Coll_Obj.prototype.keep_jump = function ()
	{	
		if (this.jump === true && this.jump_lock === true)
		{
			if (this.jump_duration < this.jump_time)
			{
				this.jump_duration += 1;
				this.dy -= this.jump_force;
			}
		} else if (this.jump === false && this.jump_lock === true)
		{
			this.jump_duration = this.jump_time;
		}
	}
	
	app.Coll_Obj.prototype.disable_start_jump = function ()
	{
		if (this.jump === true && this.jump_lock === false)
		{
			this.jump_lock = true;
		}
	}
	
	app.Coll_Obj.prototype.disable_keep_jump = function ()
	{
		if (this.jump_lock === true)
		{
			this.jump_duration = this.jump_time * 2;
		}
	}
	
	app.Coll_Obj.prototype.reload_jump = function ()
	{
		if (this.jump_lock === true)
		{
			this.jump_lock = false;
			this.jump_duration = 0;
		}
	}
	
	app.Coll_Obj.prototype.update_jump = function ()
	{
		if (this.type === 'player')
		{
			this.start_jump();
			this.keep_jump();
		} else if (this.type === 'bot')
		{
			if (this.pad_coll !== false)
			{
				if (Math.random() > (0.995 - (0.025 * app.wave / app.wave_peak)))
				{
					this.dy -= 26 + (5 * app.wave / app.wave_peak);
				}
			}
		}
	}
	
	app.Coll_Obj.prototype.update_anim_frame = function (force)
	{
		if (Math.abs(this.dx) < 0.5 && Math.abs(this.dy) < 0.5 && this.type !== 'player' && ! force)
		{
			return false;
		}
		
		this.anim_interval += 1;
		
		if (this.anim_interval === this.anim_rate)
		{	
			frame_count = Math.round(app.cv[this.anim].cv.width / this.sw);
			this.anim_frame = this.anim_frame >= frame_count - 1 ? 0 : this.anim_frame + 1;
			this.anim_interval = 0;
		}
	}
	
	app.Coll_Obj.prototype.draw_anim_frame = function (ctx, x, y)
	{
		x === undefined ? x = this.x : '';
		y === undefined ? y = this.y : '';
		
		ctx.drawImage(app.cv[this.anim].cv, this.anim_frame * this.sw, 0, this.sw, this.sh, x, y, this.sw, this.h);
	}
	
	app.Coll_Obj.prototype.move = function ()
	{
		var delta_x;
		
		switch (this.type)
		{
			case 'player':
			{
				if (this.left || this.right)
				{
					this.is_moving = true;
					this.on_move(this.left ? 0 : 1);
					
					delta_x = (this.dx_max * (this.move_duration / this.move_time));
				
					this.dx = Math.min(delta_x, this.dx_max) * (this.dir ? 1 : -1);
				} else
				{
					this.is_moving = false;
					this.move_duration = 0;
				}
				break;
			}
			case 'bot':
			{
				delta_x = this.dx_max / 2;
				if (this.can_move === true)
				{
					if (this.pad_coll !== false)
					{
						this.dir === 0 ? delta_x = -delta_x : '';
						Math.abs(this.dx) < this.dx_max / 4 ? this.dx += delta_x : '';
					} else
					{
						this.do_random_dir = true;
					}
					
					if (this.do_random_dir !== 'undefined' && this.do_random_dir === true)
					{
						if (this.pad_coll !== false)
						{
							this.do_random_dir = false;
							this.dir = Math.random() > 0.4 ? (this.dir ? 0 : 1) : this.dir;
						}
					}
				}
				
				break;
			}
		}	
	}
	
	app.Coll_Obj.prototype.update_phs = function ()
	{	
		if (this.pad_coll === false)
		{
			if (this.type === 'player' && this.left === false && this.right === false)
			{
				this.dx = this.dx * 0.94;
			} else if (this.type === 'bot')
			{
				this.dx = this.dx * 0.99;
			}
			
			if (this.jump_lock === true && this.jump === true && this.jump_duration !== 0 && this.jump_duration < this.jump_time && this.dy < 0)
			{
				this.dy_max = 36;
			} else
			{
				if (this.down === true)
				{
					this.dy_max = 42;
				} else
				{
					this.dy_max = 18;
				}
				
				this.dy < this.dy_max || this.type !== 'player' ? this.dy += 2.5  * (this.down ? 2 : 1) : this.dy = this.dy_max;
			}
			
			if (this.type === 'bot')
			{
				if (this.can_move)
				{
					this.dy > this.dy_max ? this.dy = this.dy_max : '';
				} else
				{
					this.dy > this.h - 10  ? this.dy = this.h - 10 : '';
					this.dy < -(this.h - 10) ? this.dy = -(this.h - 10) : '';
				}
			} else if (this.type === 'player')
			{
				this.dy < -this.dy_max ? this.dy = -this.dy_max : '';
			}
		} else
		{
			if (this.left === false && this.right === false || this.type !== 'player')
			{
				this.dx = this.dx * 0.6;
			
				if (Math.abs(this.dx) < 0.2)
				{
					this.dx = 0;
				}
			}
			
			if (this.jump === false || this.type === 'bot')
			{
				this.dy = 2.8;
			}
		}
	}
	
	app.Coll_Obj.prototype.update_pos = function ()
	{
		this.x += this.dx;
		this.y += this.dy;
	}
	
	app.Coll_Obj.prototype.destroy = function ()
	{
		if (this.type !== 'player')
		{
			app[this.type + '_id'].push(this.id);
			delete app[this.type][this.id];
		}
		
		if (this.on_destroy)
		{
			this.on_destroy();
		}
	}
	
	app.Coll_Obj.prototype.sht_p = function (obj_name, x, y, dir, dir_d, f, count, count_delta, c)
	{
		var obj;
		var count = count + Math.floor(Math.random() * count_delta || 0);
		var d1;
		var f1;
		this.dir !== undefined ? (this.dir === 1 ? dir = -dir : '') : '';
		dir -= Math.PI / 2;
		
		if (obj_name === 'Blood')
		{
			if(app.url_params.blood_level === 0)
			{
				return false;
			} else if (app.url_params.blood_level !== 3 && app.url_params.blood_level < 10)
			{
				count = count * app.url_params.blood_level / 3;
				count_delta = count * app.url_params.blood_level / 3;
			}
		}
		
		for (var a = 0; a < count; a += 1)
		{
			d1 = dir - dir_d / 2 + Math.random() * dir_d;
			f1 = f * (Math.random() + 0.3);
			obj = app.create_obj(obj_name, c);
			obj.x = x;
			obj.y = y;
			obj.dx += Math.cos(d1) * f1;
			obj.dy += Math.sin(d1) * f1 - f1 / 2;
		}
	}
	
	app.Plr = function () 
	{
		this.rank = 0;
		this.type = 'player';
		this.dir = 1;
		this.w = 22;
		this.sw = 54;
		this.sh = 54;
		this.hp = 30;
		this.dhp = 0;
		this.skin = 'frenzy_white_1';
		this.anim = 'player_run_frenzy_white_1';
		this.anim_frame = 0;
		this.anim_rate = 3;
		this.anim_interval = 0;
		this.jump_time = 13;
		this.jump_duration = 0;
		this.jump_force = 8;
		this.jump_lock = false;
		this.grab_rld = false;
		this.bot_coll = [];
		this.frenzy = false;
		this.frenzy_start = false;
		this.frenzy_end = false;
		this.kill_count = 0;
		this.move_time = 10;
		this.move_duration = 0;
		this.is_grab = false;
		this.score = 0;
		
		return this;
	};
	app.Plr.prototype = new app.Coll_Obj();
	
	app.Plr.prototype.update_grab = function ()
	{
		if (this.grab === true && this.grab_rld === false)
		{
			if ( ! this.is_grab && this.b_0)
			{
				this.b_0.can_move = false;
				this.is_grab = this.b_0;
				app.toggle_bool('grab_rld', 300, true, this);
				app.play_sfx('grab');
			} else if (this.is_grab)
			{
				this.is_grab = false;
				this.throw_item(this.b_0);
				app.toggle_bool('grab_rld', 300, true, this);
				app.play_sfx('grab');
			} else if ( ! this.b_0 && ! this.frenzy)
			{
				app.play_sfx('idle_attack');
			}
		} 
		
		if (this.is_grab)
		{
			this.b_0.x = this.x + (this.dir === 0 ? 1 : -1);
			this.b_0.y = this.y - this.h / 2 - 6;
			this.b_0.dx = this.dx;
			this.b_0.dy = this.dy;
			this.b_0.dir = this.dir;
		}
	}
	
	app.Plr.prototype.throw_item = function (item)
	{
		item.dx += this.dx + (this.dir === 0 ? -1 : 1) * 10 + app.wave / 2 * (this.frenzy ? 2 : 1);
		item.dy += (this.frenzy ? 3 : 1) * -15 + this.dy;
		item.dy < -item.h ? item.dy = -item.h : '';
	}
	
	app.Plr.prototype.on_move = function (dir)
	{
		var p = this;
		
		this.last_dir = this.dir;
		this.dir = dir;
		
		this.dir === this.last_dir ? (this.move_duration < this.move_time ? this.move_duration += 1 : '') : this.move_duration = 0;
		
		if (p.pad_coll !== false && app.url_params.sfx && ! p.frenzy)
		{
			var sfx_name = 'footstep_' + Math.ceil(Math.random() * 2.99);
			
			if (p.move_duration < 2)
			{
				app.play_sfx(sfx_name);
			}
			
			if ( ! p.move_sfx && ! p.frenzy)
			{
				p.move_sfx = setInterval(function ()
				{
					if (p.is_moving && p.pad_coll !== false && ! p.frenzy && ! p.attack)
					{
						app.play_sfx(sfx_name);
					} else
					{
						clearInterval(p.move_sfx);
						delete p.move_sfx;
					}
				}, 240);
			}
		}
	}
	
	app.Plr.prototype.update_attack = function ()
	{
		if (this.attack && this.b_0)
		{
			this.b_0.dhp -= this.frenzy ? 20 : 3.5;
			if (this.b_0.hp - this.b_0.dhp < 0 && this.is_grab)
			{
				delete this.is_grab;
			}
			
			this.dhp += this.frenzy ? 0 : (this.b_0.b_t !== 0 ? 0.5 : 1) * 0.45;
		
			app.play_sfx('feed');
		} else if (this.attack && ! this.frenzy)
		{
			app.play_sfx('idle_attack');
		}
	}
	
	app.Plr.prototype.update_kill_ct = function ()
	{
		this.kill_count += 1;
		//this.bot_coll = false;
		this.is_grab = false;
	}
	
	app.Plr.prototype.update_hp = function ()
	{
		var bot;
		
		if (this.frenzy)
		{
			this.dhp -= 0.24;
			
			if (this.hp < 30)
			{
				this.frenzy = false;
				app.toggle_bool('frenzy_end', 1, true, this, function () 
				{ 
					app.toggle_bool('wave_break', 3000, true);
				});
			}
			
			this.sht_p('Blood', this.x, this.y, Math.PI / 4, Math.PI / 4, 40, 5, 10);
		} else
		{
			if (this.hp > 100)
			{
				this.hp = 100;
				this.frenzy = true;
				app.toggle_bool('frenzy_start', 1500, true, this);
				//app.update_hud_msg('frenzy time !!!');
			} else if (this.hp > 0)
			{
				if (this.b_0 && ! app.wave_break)
				{
					this.bot_coll.forEach(function (bot)
					{
						this.dhp -= bot.dmg;
						
						if (bot.dmg > 0)
						{
							app.play_sfx('hurt');
							
						}
					}, this);
				}
				
				if (this.hp > 30)
				{
					this.dhp -= 0.024;
				}
			} else
			{
				app.end_game();
			}
		}
		
		this.hp += this.dhp;
		this.pdhp = this.dhp;
		this.dhp = 0;
	}
	
	app.Plr.prototype.update_stats = function (bot)
	{
		app.ckill_count += 1;
		app.ckill_pts_buff += (10 + 5 * bot.b_t) * (1 + app.wave / 5) * app.ckill_count;
		
		app.ckill_count > 1 ? app.update_hud_msg(((app.ckill_count <= app.ckill_msg.length ? app.ckill_msg[app.ckill_count - 2] + ' kill!': (app.ckill_count) + ' killstreak!')) + ' (+' + app.ckill_pts_buff + 'pts)') : '';
		app.plr.score += (10 + 5 * bot.b_t) * (1 + app.wave / 5) * app.ckill_count;
		
		app.toggle_bool('ckill', 2500, true, app, function () {
			if (app.ckill_count > app.ckill_max_count)
			{
				app.ckill_max_count = app.ckill_count;
				if (app.ckill_count > 1)
				{
					app.toggle_bool('ckill_record_msg', app.wave_break ? 5000 : 3000, true);
					app.play_sfx('exp_1');
				}
			}
			app.ckill_pts_buff > app.ckill_max_pts ? app.ckill_max_pts = app.ckill_pts_buff : '';
			app.ckill_count = 0;
			app.ckill_pts_buff = 0;
		});
	}
	
	app.Bot = function ()
	{
		this.type = 'bot';
		this.dhp = 0;
		this.hp = 100;
		this.anim = 'bot_walk';
		this.anim_frame = 0;
		this.anim_rate = 3;
		this.anim_interval = 0;
		this.sw = 54;
		this.sh = 54;
		this.dir = 0;
		this.is_attacked = false;
		this.can_move = true;	
		this.dy_max = 16;
		this.dx_max = 10;
		
		return this;
	}
	app.Bot.prototype = new app.Coll_Obj();
	
	app.Bot.prototype.on_destroy = function ()
	{
		var self = this;
		
		if ( ! app.plr.frenzy)
		{
			app.plr.dhp += (-this.dhp) / 4.5 + (4 * this.b_t);
		}
		
		if (this.dhp > -21)
		{		
			app.grant_achv('feeder', 2, 2500, this.dhp < -10 ? 0.2 : 1);	
		}
		
		this.sht_p('Blood', this.x, this.y, 0, Math.PI * 2, 30, app.plr.frenzy ? 200 : 100, 100);
		this.sht_p('Body_Part', this.x - this.dx, this.y - this.dy, 0, Math.PI * 2, 15, 8, 3, function (obj) 
		{
			obj.dir = Math.floor(Math.random() * 2);
			obj.anim = 'body_part_' + Math.ceil(Math.random() * 3) + '_' +  app.bot_types[self.b_t].skin + '_1';
			
			obj.timer_events.forEach(function (elem)
			{
				! obj.timers ? obj.timers = [] : '';
				obj.timers.push(setInterval(elem[1], elem[0]));
			});
			
			obj.on_destroy = function ()
			{
				obj.timers.forEach(function (elem)
				{
					clearInterval(elem);
				});
			}
		});
		
		app.set_screen_shake(150);
		
		app.plr.update_stats(this);
		
		app.update_bot_track(this.b_t, false);
		
		app.play_sfx('exp_1');
	}
	
	app.Bot.prototype.special_kill = function (type)
	{
		if (type === 0)
		{
			this.dhp -= 75 * (app.plr.frenzy ? 2 : 1);
			app.grant_achv('crusher', 3, 1250, 1);
		} else if (type === 1)
		{
			if (this.can_move)
			{
				this.dx += (this.x < app.plr.x ? -1 : 1) * 10;
				this.dy -= 20;
				this.pad_coll = false;
				this.y -= 5;
			}
			this.dhp -= 75 * (app.plr.frenzy ? 2 : 1);
			app.grant_achv('grinder', 3, 1250, 1);
		}
	}
	
	app.Blood = function ()
	{
		var self = this;
		this.type = 'blood';
		this.w = 6;
		this.h = 6;
		this.destroy_timeout = setTimeout(function ()
		{
			app.blood_buff.push({ x:self.x, y: self.y})
			self.destroy();
		}, 100 + Math.random() * 750);
	}
	app.Blood.prototype = new app.Coll_Obj();	
	
	app.Body_Part = function ()
	{
		var self = this;
		this.type = 'body_part';
		this.w = 24;
		this.h = 24;
		this.sw = 24;
		this.sh = 24;
		this.anim = 'body_part_1';
		this.anim_frame = 0;
		this.anim_rate = 3;
		this.anim_interval = 0;
		this.bounce = 0.5;
		this.timer_events = [
			[30, function ()
			{
				self.sht_p('Blood', self.x, self.y, 0, Math.PI, 10, 1, 1);
			}]
		];
		this.destroy_timeout = setTimeout(function ()
		{
			self.destroy();
		}, 1500 + Math.random() * 2000);
	}
	app.Body_Part.prototype = new app.Coll_Obj();	
	
	app.init_app();
}