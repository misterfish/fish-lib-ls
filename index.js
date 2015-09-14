// Generated by LiveScript 1.4.0
/*
 * Useful stuff for writing in LiveScript.
 *
 * Source: misterfish@github/fish-lib-ls
 *
 * License: GPL 2.0
 *
 * Author: Allen Haim <allen@netherrealm.net>
 */
(function(){
  var childProcess, ref$, curry, join, last, map, each, compact, keys, values, shellQuoteModule, sprintf, globFs, BULLETS, Identifier, Sys, Err, green, brightGreen, blue, brightBlue, red, brightRed, yellow, brightYellow, cyan, brightCyan, magenta, brightMagenta, _, ident, k, v, slice$ = [].slice, toString$ = {}.toString, split$ = ''.split;
  childProcess = require('child_process');
  ref$ = require("prelude-ls"), curry = ref$.curry, join = ref$.join, last = ref$.last, map = ref$.map, each = ref$.each, compact = ref$.compact, keys = ref$.keys, values = ref$.values;
  shellQuoteModule = require('shell-quote');
  sprintf = require('sprintf');
  globFs = require('glob-fs');
  BULLETS = ['꣐', '⩕', '٭', '᳅', '𝄢', '𝄓', '𝄋', '𝁐', 'ᨁ'];
  Identifier = {
    main: {},
    color: {},
    util: {}
  };
  Sys = {
    die: false,
    verbose: true,
    quiet: false,
    sync: false,
    errCapture: false,
    outCapture: true,
    slurp: true,
    ignoreNodeSyserr: false,
    keepTrailingNewline: false
  };
  Err = {
    fatal: true,
    stackTrace: false
  };
  green = curry(color)('green');
  brightGreen = curry(color)('bright-green');
  blue = curry(color)('blue');
  brightBlue = curry(color)('blue');
  red = curry(color)('red');
  brightRed = curry(color)('bright-red');
  yellow = curry(color)('yellow');
  brightYellow = curry(color)('bright-yellow');
  cyan = curry(color)('cyan');
  brightCyan = curry(color)('bright-cyan');
  magenta = curry(color)('magenta');
  brightMagenta = curry(color)('bright-magenta');
  function shellParse(){
    return shellQuoteModule.parse.apply(this, arguments);
  }
  function shellQuote(arg){
    if (isArray(arg)) {} else if (isStr(arg)) {
      arg = [arg];
    } else {
      icomplain1('Bad call');
    }
    return shellQuoteModule.quote(arg);
  }
  function log(){
    var msg;
    msg = slice$.call(arguments);
    return console.log.apply(console, msg);
  }
  /*
  function logf ...msg
      opts = msg.pop()
      if typeof! opts is not 'Object' then
          iwarn 'bad call'
          return
      newline = true unless opts.newline == false or opts.nl == false
      if newline
          log.apply this, msg # preferable because dumps deeper
      else
          process.stdout.write join ' ' msg
  */
  function iwarn(){
    var msg, opts;
    msg = slice$.call(arguments);
    opts = last(msg);
    if (toString$.call(opts).slice(8, -1) === 'Object') {
      msg.pop();
    } else {
      opts = {};
    }
    return pcomplain(mergeObjects(opts, {
      msg: msg,
      internal: true,
      error: false
    }));
  }
  function ierror(){
    var msg, opts;
    msg = slice$.call(arguments);
    opts = last(msg);
    if (toString$.call(opts).slice(8, -1) === 'Object') {
      msg.pop();
    } else {
      opts = {};
    }
    return pcomplain(mergeObjects(opts, {
      msg: msg,
      internal: true,
      error: true
    }));
  }
  function warn(){
    var msg, opts;
    msg = slice$.call(arguments);
    opts = last(msg);
    if (isObj(opts)) {
      msg.pop();
    } else {
      opts = {};
    }
    return pcomplain(mergeObjects(opts, {
      msg: msg,
      internal: false,
      error: false
    }));
  }
  function error(){
    var msg, opts;
    msg = slice$.call(arguments);
    opts = last(msg);
    if (isObj(opts)) {
      msg.pop();
    } else {
      opts = {};
    }
    return pcomplain(mergeObjects(opts, {
      msg: msg,
      internal: false,
      error: true
    }));
  }
  function shuffle(input){
    var l, out, locations, res$, i$, to$, i, locationsNumKeys;
    l = input.length;
    out = [];
    res$ = {};
    for (i$ = 0, to$ = l - 1; i$ <= to$; ++i$) {
      i = i$;
      res$[i] = 42;
    }
    locations = res$;
    locationsNumKeys = l;
    times(l, function(){
      var key, m, val;
      key = keys(locations)[m = Math.floor(Math.random() * locationsNumKeys)];
      delete locations[key];
      val = input[key];
      out.push(val);
      return locationsNumKeys--;
    });
    return out;
  }
  function mergeObjects(){
    var i$, len$, obj, k, v, resultObj$ = {};
    for (i$ = 0, len$ = arguments.length; i$ < len$; ++i$) {
      obj = arguments[i$];
      for (k in obj) {
        v = obj[k];
        if (toString$.call(obj).slice(8, -1) === 'Object') {
          resultObj$[k] = v;
        }
      }
    }
    return resultObj$;
  }
  function bullet(){
    return BULLETS[Math.floor(Math.random() * BULLETS.length)];
  }
  function ord(it){
    if (!isStr(it)) {
      return icomplain1('Bad call');
    }
    if (it.length > 1) {
      warn("Ignoring extra chars (got '" + green(it.substr(0, 1)) + brightRed(it.substr(1)) + "' ");
    }
    return it.charCodeAt(0);
  }
  function chr(it){
    if (!isNum(it)) {
      return icomplain1('Bad call');
    }
    return String.fromCharCode(it);
  }
  function info(){
    var prnt;
    prnt = [].slice.call(arguments);
    prnt.unshift(blue(bullet()));
    console.log.apply(console, prnt);
  }
  function errSet(opts){
    return confSet(Err, 'err', opts);
  }
  function sysSet(opts){
    return confSet(Sys, 'sys', opts);
  }
  function sysOk(){
    var argsArray, onxxx, onok, onnotok, opts;
    argsArray = [].slice.call(arguments);
    onxxx = argsArray.pop();
    if (toString$.call(onxxx).slice(8, -1) !== 'Function') {
      iwarn('bad call');
      return;
    }
    if (toString$.call(last(argsArray)).slice(8, -1) === 'Function') {
      onok = argsArray.pop();
      onnotok = onxxx;
    } else {
      onok = onxxx;
      onnotok = void 8;
    }
    opts = {
      oncomplete: function(arg$){
        var ok, out, err;
        ok = arg$.ok, out = arg$.out, err = arg$.err;
        if (ok) {
          if (onok) {
            return onok();
          }
        } else {
          if (onnotok) {
            return onnotok();
          }
        }
      },
      quiet: true
    };
    argsArray.push(opts);
    return sys.apply(this, argsArray);
  }
  /*
   * - - - 
   *
   *
   * Usage:
   *
   * {opts} is always last and always optional.
   *
   * sys {opts}                                            # 1
   * sys 'cmd', {opts}                                     # 2
   * sys 'cmd', [args], {opts}                             # 3
   * sys 'cmd', [args], oncomplete, {opts}                 # 4
   * sys 'cmd', oncomplete, {opts}                         # 5
   * sys 'cmd', 'arg1', ... , oncomplete, {opts}           # 6
   * sys 'cmd', 'arg1', ... , {opts}                       # 7
   *
   * We use spawn instead of exec for better buffering control (exec can
   * easily overflow and die).
   *
   * If oncomplete is given or opt 'sync' is false, use async. 
   * sync is not possible without more recent nodes by the way.
   *
   * The spawn object is returned in all cases and the caller can do what
   * they want with it. 
   * 
   * oncomplete is for success and error both.
   *    params: ok, code, out, err
   *
   * If out-ignore or err-ignore is true, those streams are not listened
   * on. (Caller still can, though).
   *
   * Otherwise:
   *
   *  If out-capture/err-capture is true, read everything into a scalar/list (depending
   *  on out-list/err-list) and pass it to oncomplete. If oncomplete is
   *  nothing then capture-xxx are set to false.
   *
   *  If out-capture/err-capture is false, print to stdout/stderr.
   *
   * cmd can be 'ls -t /tmp', or cmd can be 'ls' and args can be 
   * <[ -t tmp ]>, or cmd can even be 'ls -t' and args can be ['/tmp'].
   *
   * 'quiet' is useful for commands like find, which return
   * non-zero if there were any warnings, but we don't want a warning or
   * error. quiet mixed with die will be ignored.
   *
   * Return the spawn object in all cases.
   */
  function sys(){
    var args, numArgs, opts, cmd, cmdArgs, oncomplete, argsArray;
    args = arguments;
    numArgs = arguments.length;
    if (toString$.call(last(args)).slice(8, -1) !== 'Object') {
      args[numArgs] = {};
      args.length++;
      return sys.apply(this, args);
    }
    if (numArgs === 1) {
      opts = args[0];
    } else if (numArgs === 2) {
      cmd = args[0], opts = args[1];
      opts.cmd = cmd;
    } else if (numArgs === 3 && toString$.call(args[1]).slice(8, -1) === 'Array') {
      cmd = args[0], cmdArgs = args[1], opts = args[2];
      opts.cmd = cmd;
      opts.args = cmdArgs;
    } else if (numArgs === 4 && toString$.call(args[1]).slice(8, -1) === 'Array') {
      cmd = args[0], cmdArgs = args[1], oncomplete = args[2], opts = args[3];
      opts.cmd = cmd;
      opts.args = cmdArgs;
      opts.oncomplete = oncomplete;
    } else if (numArgs === 3 && toString$.call(args[1]).slice(8, -1) === 'Function') {
      cmd = args[0], oncomplete = args[1], opts = args[2];
      opts.cmd = cmd;
      opts.oncomplete = oncomplete;
    } else if (numArgs >= 4 && toString$.call(args[numArgs - 2]).slice(8, -1) === 'Function') {
      argsArray = [].slice.call(args);
      opts = argsArray.pop();
      oncomplete = argsArray.pop();
      cmd = argsArray[0], cmdArgs = slice$.call(argsArray, 1);
      opts.cmd = cmd;
      opts.args = cmdArgs;
      opts.oncomplete = oncomplete;
    } else if (numArgs >= 3) {
      argsArray = [].slice.call(args);
      opts = argsArray.pop();
      cmd = argsArray[0], cmdArgs = slice$.call(argsArray, 1);
      opts.cmd = cmd;
      opts.args = cmdArgs;
    } else {
      ierror('bad call');
    }
    return sysdo(opts);
  }
  function isStr(it){
    return toString$.call(it).slice(8, -1) === 'String';
  }
  function isString(it){
    return toString$.call(it).slice(8, -1) === 'String';
  }
  function isBool(it){
    return toString$.call(it).slice(8, -1) === 'Boolean';
  }
  function isBoolean(it){
    return toString$.call(it).slice(8, -1) === 'Boolean';
  }
  function isObj(it){
    return toString$.call(it).slice(8, -1) === 'Object';
  }
  function isObject(it){
    return toString$.call(it).slice(8, -1) === 'Object';
  }
  function isArray(){
    return isArr.apply(this, arguments);
  }
  function isArr(it){
    return toString$.call(it).slice(8, -1) === 'Array';
  }
  function isNum(it){
    return toString$.call(it).slice(8, -1) === 'Number';
  }
  function isNumber(it){
    return toString$.call(it).slice(8, -1) === 'Number';
  }
  function isInteger(it){
    return isNum(it) && it === Math.floor(it);
  }
  function isInt(it){
    return isNum(it) && it === Math.floor(it);
  }
  function isPositiveInt(it){
    return isInt(it) && it > 0;
  }
  function isNonNegativeInt(it){
    return isInt(it) && it >= 0;
  }
  /* 
   * a and b are integers.
   * step by +1 or -1 to get from a to b, inclusive.
   */
  function range(a, b, func){
    var i$, i, results$ = [];
    if (!(isInt(a) && isInt(b))) {
      return icomplain1('Bad call');
    }
    for (i$ = a; i$ <= b; ++i$) {
      i = i$;
      results$.push(func(i));
    }
    return results$;
  }
  function times(n, func){
    var i$, i, results$ = [];
    if (!isPositiveInt(n)) {
      return icomplain1('Bad call');
    }
    for (i$ = 1; i$ <= n; ++i$) {
      i = i$;
      results$.push(func(i - 1));
    }
    return results$;
  }
  function importAll(target){
    var k, ref$, v, results$ = [];
    for (k in ref$ = module.exports) {
      v = ref$[k];
      results$.push(target[k] = v);
    }
    return results$;
  }
  /*
   * Expand elements of kinds if they are arrays.
   * So this is called as:
   * 
   * fish-lib-ls.import-kind global,
   *    <[ main color util ]>
   * 
   * or
   * 
   * fish-lib-ls.import-kind global,
   *    'main' 'color' 'util'
   */
  function importKind(target){
    var kinds, doit, i$, len$, elem, lresult$, j$, len1$, kind, results$ = [];
    kinds = slice$.call(arguments, 1);
    doit = function(kind){
      var identifiers, k, v, results$ = [];
      identifiers = Identifier[kind];
      if (identifiers == null) {
        return ierror('bad import:', brightRed(kind), {
          stackRewind: 1
        });
      }
      for (k in identifiers) {
        v = identifiers[k];
        results$.push(target[k] = v);
      }
      return results$;
    };
    for (i$ = 0, len$ = kinds.length; i$ < len$; ++i$) {
      elem = kinds[i$];
      lresult$ = [];
      if (isArray(elem)) {
        for (j$ = 0, len1$ = elem.length; j$ < len1$; ++j$) {
          kind = elem[j$];
          lresult$.push(doit(kind));
        }
      } else {
        lresult$.push(doit(elem));
      }
      results$.push(lresult$);
    }
    return results$;
  }
  /* usage:
  
   --n, -n, --na, --nam, -nam, all alias to name by default (if it's not a
   cluster of other opts).
   But in this case -n and -a cluster. so -na is -n -a while -nam is --name.
  
   opt = getopt do
     s: 'b'
     t: 'b'
     path: 'p'
     name: 's'
     alpha: 'ms' # will become an array
     n: 'b'
     a:
       'b'
       some-option: 'val' # although no options are currently supported (nopt doesn't seem very configurable)
  
   { name, math, alpha, path } = opt
   name or error 'Missing name'
  
  */
  function getopt(args){
    var nopt, path, knownOpts, shortHands, types, arrangedKeys, i$, len$, opt, v, type, opts, parsed, k;
    nopt = require('nopt');
    path == null && (path = require('path'));
    knownOpts = {};
    shortHands = {};
    types = {
      b: Boolean,
      s: String,
      r: Number,
      p: path,
      ms: Array
    };
    arrangedKeys = function(){
      var list, opt, ref$, v;
      list = [];
      for (opt in ref$ = args) {
        v = ref$[opt];
        if (opt.length === 1) {
          list.push(opt);
        } else {
          list.unshift(opt);
        }
      }
      return list;
    }();
    for (i$ = 0, len$ = arrangedKeys.length; i$ < len$; ++i$) {
      opt = arrangedKeys[i$];
      v = args[opt];
      if (isArray(v)) {
        type = v[0], opts = v[1];
      } else {
        type = v;
      }
      fn$();
    }
    parsed = nopt(knownOpts, shortHands, process.argv, 2);
    for (k in parsed) {
      v = parsed[k];
      if (k === 'argv') {
        continue;
      }
      if (!knownOpts[k]) {
        error("Unknown option:", brightRed(k));
      }
    }
    return parsed;
    function fn$(){
      var long, longType, ref$;
      long = opt;
      longType = (ref$ = types[type]) != null
        ? ref$
        : error('Invalid type:', brightRed(type));
      knownOpts[long] = longType;
      return shortHands[long.substring(0, 1)] = ['--' + long];
    }
  }
  function confSet(obj, name, opts){
    var k, v, results$ = [];
    name == null && (name = 'unknown');
    for (k in opts) {
      v = opts[k];
      if (obj[k] == null) {
        iwarn("Invalid opt for " + yellow(name) + ": " + brightRed(k));
        continue;
      }
      results$.push(obj[k] = v);
    }
    return results$;
  }
  function color(col, s){
    var str, opt;
    if (toString$.call(s).slice(8, -1) === 'Array') {
      str = s[0], opt = s[1];
    } else {
      str = s;
      opt = {};
    }
    return join('', [_color(col, opt), str, _color('reset', opt)]);
  }
  function _color(c, arg$){
    var warnOnError, col;
    warnOnError = (arg$ != null
      ? arg$
      : {}).warnOnError;
    warnOnError == null && (warnOnError = true);
    col = {
      red: 31,
      'bright-red': 91,
      green: 32,
      'bright-green': 92,
      yellow: 33,
      'bright-yellow': 93,
      blue: 34,
      'bright-blue': 94,
      magenta: 35,
      'bright-magenta': 95,
      cyan: 36,
      'bright-cyan': 96,
      reset: 0
    }[c];
    if (col == null) {
      if (warnOnError) {
        iwarn("Invalid color:", c);
      }
      return '';
    }
    return '[' + col + 'm';
  }
  /**
    * @private
    */
  function sysdo(arg$){
    var cmd, oncomplete, args, ref$, die, verbose, quiet, sync, outCapture, errCapture, outList, errList, outIgnore, errIgnore, slurp, ignoreNodeSyserr, keepTrailingNewline, syserrorFired, streamData, opts, cmdBin, cmdArgs, spawned, streamConfig, handleDataAsList, handleData, thisError;
    cmd = arg$.cmd, oncomplete = arg$.oncomplete, args = (ref$ = arg$.args) != null
      ? ref$
      : [], die = (ref$ = arg$.die) != null
      ? ref$
      : Sys.die, verbose = (ref$ = arg$.verbose) != null
      ? ref$
      : Sys.verbose, quiet = (ref$ = arg$.quiet) != null
      ? ref$
      : Sys.quiet, sync = (ref$ = arg$.sync) != null
      ? ref$
      : Sys.sync, outCapture = (ref$ = arg$.outCapture) != null
      ? ref$
      : Sys.outCapture, errCapture = (ref$ = arg$.errCapture) != null
      ? ref$
      : Sys.errCapture, outList = (ref$ = arg$.outList) != null ? ref$ : false, errList = (ref$ = arg$.errList) != null ? ref$ : false, outIgnore = (ref$ = arg$.outIgnore) != null ? ref$ : false, errIgnore = (ref$ = arg$.errIgnore) != null ? ref$ : false, slurp = (ref$ = arg$.slurp) != null
      ? ref$
      : Sys.slurp, ignoreNodeSyserr = (ref$ = arg$.ignoreNodeSyserr) != null
      ? ref$
      : Sys.ignoreNodeSyserr, keepTrailingNewline = (ref$ = arg$.keepTrailingNewline) != null
      ? ref$
      : Sys.keepTrailingNewline;
    syserrorFired = false;
    streamData = {};
    if (outList) {
      streamData.out = [];
    } else {
      streamData.out = '';
    }
    if (errList) {
      streamData.err = [];
    } else {
      streamData.err = '';
    }
    if (sync) {
      iwarn("sys sync not implemented");
      return;
    }
    if (oncomplete != null) {
      if (toString$.call(oncomplete).slice(8, -1) !== 'Function') {
        ierror('bad call');
      }
    } else {
      outCapture = false;
      errCapture = false;
    }
    opts = {};
    ref$ = function(){
      var parse, parsedBin, parsedArgs;
      parse = shellParse(cmd);
      parsedBin = parse.shift();
      parsedArgs = [];
      parse = map(function(it){
        var that;
        if (isObj(it)) {
          if (it.op === 'glob') {
            log('yes', it);
            if ((that = it.pattern) != null) {
              return each(function(it){
                return parsedArgs.push(it);
              })(
              globFs().readdirSync(that));
            } else {
              war("Can't deal with parsed arg:", it);
              return [];
            }
          } else {
            war("Can't deal with parsed arg:", it);
            return [];
          }
        } else {
          return parsedArgs.push(it);
        }
      })(
      parse);
      return [parsedBin, parsedArgs.concat(args)];
    }(), cmdBin = ref$[0], cmdArgs = ref$[1];
    if (verbose) {
      (function(){
        var args;
        args = map(function(it){
          return it;
        }, cmdArgs);
        args.unshift(cmdBin);
        return log(green(bullet()) + " " + shellQuote(args));
      })();
    }
    spawned = childProcess.spawn(cmdBin, cmdArgs, opts);
    streamConfig = {
      out: {
        ignore: outIgnore,
        spawnStream: spawned.stdout,
        capture: outCapture,
        list: outList,
        which: 'out',
        procStream: process.stdout
      },
      err: {
        ignore: errIgnore,
        spawnStream: spawned.stderr,
        capture: errCapture,
        list: errList,
        which: 'err',
        procStream: process.stderr
      }
    };
    handleDataAsList = function(strc, str){
      var stream, split, last, first, firstCurIsNewline, lastPrevWasPartial;
      stream = streamData[strc.which];
      split = split$.call(str, '\n');
      if (stream.length > 0) {
        last = stream[stream.length - 1];
        first = split[0];
        firstCurIsNewline = first === '';
        lastPrevWasPartial = last !== '';
        if (lastPrevWasPartial) {
          if (firstCurIsNewline) {
            split.shift();
          } else {
            stream[stream.length - 1] += split.shift();
          }
        } else {
          stream.pop();
        }
      }
      return each(partialize$.apply(stream, [stream.push, [void 8], [0]]), split);
    };
    handleData = function(strc, str){
      if (strc.capture) {
        if (strc.list) {
          return handleDataAsList(strc, str);
        } else {
          return streamData[strc.which] += str;
        }
      } else {
        return strc.procStream.write(str);
      }
    };
    each(function(it){
      it.spawnStream.on('error', function(error){
        return iwarn("Got error on stream std" + which + " (" + error + ")");
      });
      if (it.ignore) {
        return;
      }
      it.spawnStream.on('data', function(data){
        var str;
        if (isString(data)) {
          str = data;
        } else if (Buffer.isBuffer(data)) {
          str = data.toString();
        } else {
          return iwarn("Doesn't seem to be a Buffer or a string");
        }
        return handleData(it, str);
      });
      return it.spawnStream.on('end', function(){
        var out;
        if (!keepTrailingNewline) {
          out = streamData.out;
          if (outList) {
            if (last(out) === '') {
              return out.pop();
            }
          } else if (out.substring(out.length - 1) === '\n') {
            return streamData.out = out.substring(0, out.length - 1);
          }
        }
      });
    })(
    values(streamConfig));
    thisError = function(){
      return syserror(mergeObjects(args, {
        cmd: cmd,
        oncomplete: oncomplete,
        die: die,
        quiet: quiet,
        out: streamData.out,
        err: streamData.err
      }));
    };
    spawned.on('error', function(errobj){
      var errmsg, syserrorFired;
      errmsg = errobj.message;
      if (!ignoreNodeSyserr) {
        handleData(streamConfig.err, errmsg);
      }
      if (!syserrorFired) {
        syserrorFired = true;
        return thisError({});
      }
    });
    spawned.on('close', function(code, signal){
      var syserrorFired;
      if (code !== 0) {
        if (!syserrorFired) {
          syserrorFired = true;
          return thisError({
            code: code,
            signal: signal
          });
        }
      } else {
        if (oncomplete != null) {
          if (oncomplete != null) {
            return oncomplete({
              ok: true,
              code: code,
              out: streamData.out,
              err: streamData.err
            });
          }
        }
      }
    });
    return spawned;
  }
  /**
   * @private
   */
  function syserror(arg$){
    var cmd, code, signal, oncomplete, out, err, die, quiet, strSig, strCmd, strExit, str;
    cmd = arg$.cmd, code = arg$.code, signal = arg$.signal, oncomplete = arg$.oncomplete, out = arg$.out, err = arg$.err, die = arg$.die, quiet = arg$.quiet;
    if (signal) {
      strSig = " «got signal " + cyan(signal) + "»";
    }
    strCmd = " «" + brightRed(cmd) + "»";
    if (code) {
      strExit = " «exit status " + yellow(code) + "»";
    }
    str = join('', compact(["Couldn't execute cmd", strCmd, strExit, strSig]));
    if (die) {
      error(str);
      process.exit(code);
    } else {
      if (!quiet) {
        warn(str);
      }
    }
    if (oncomplete != null) {
      return oncomplete({
        ok: false,
        code: code,
        out: out,
        err: err
      });
    }
  }
  /**
   * @private
   */
  /*
   * Checks Err.fatal and routes through either ierror or iwarn with stack-rewind bumped by one.
   */
  function icomplain(){
    var msg, opts, func;
    msg = slice$.call(arguments);
    opts = last(msg);
    if (toString$.call(opts).slice(8, -1) === 'Object') {
      msg.pop();
    } else {
      opts = {};
    }
    func = Err.fatal && ierror || iwarn;
    opts.stackRewind == null && (opts.stackRewind = 0);
    opts.stackRewind++;
    return func(msg, opts);
  }
  /*
   * Like calling icomplain msg, stack-rewind: 1
   * However since it's another call on the stack, it's 2 in the call.
   * 
   */
  function icomplain1(){
    var msg, opts;
    msg = slice$.call(arguments);
    opts = last(msg);
    if (isObj(opts)) {
      msg.pop();
    } else {
      opts = {};
    }
    opts.stackRewind = 2;
    return icomplain(msg, opts);
  }
  /**
   * @private
   *
   * All error and warn functions route through this underlying one.
   */
  function pcomplain(arg$){
    var msg, internal, error, stackTrace, code, stackRewind, ref$, stack, funcname, filename, lineNum, bulletColor;
    msg = arg$.msg, internal = arg$.internal, error = arg$.error, stackTrace = arg$.stackTrace, code = arg$.code, stackRewind = (ref$ = arg$.stackRewind) != null ? ref$ : 0;
    stackTrace == null && (stackTrace = Err.stackTrace);
    stack = (new Error).stack;
    if (stack == null) {
      stack = '';
    }
    stack = stack.replace(/^\s*\S+\s+/, '   ');
    ref$ = function(){
      var regex, myStack, m;
      regex = repeatString$(".*\n", 2 + stackRewind);
      myStack = stack.replace(RegExp('^' + regex), '');
      if (m = myStack.match(/^\s+at\s+(\S+)\s*\((.+?):(\d+):\d+\)/)) {
        return [m[1], m[2], m[3]];
      } else if (m = myStack.match(/^\s+at\s+(.+?):(\d+):\d+/)) {
        return [void 8, m[1], m[2]];
      } else {
        return ["«unknown-file»", "«unknown-line»"];
      }
    }(), funcname = ref$[0], filename = ref$[1], lineNum = ref$[2];
    if (internal) {
      if (error) {
        msg.unshift("Internal error:");
      } else {
        msg.unshift("Internal warning:");
      }
    } else {
      if (error) {
        msg.unshift("Error:");
      } else {
        msg.unshift("Warning:");
      }
    }
    if (error) {
      bulletColor = red;
    } else {
      bulletColor = brightRed;
    }
    msg.unshift(bulletColor([
      bullet(), {
        warnOnError: false
      }
    ]));
    if (internal) {
      msg.push("(" + (yellow([
        filename, {
          warnOnError: false
        }
      ]) + "") + function(){
        if (funcname) {
          return ":" + (green([
            funcname, {
              warnOnError: false
            }
          ]) + "");
        } else {
          return '';
        }
      }() + ":" + (brightRed([
        lineNum, {
          warnOnError: false
        }
      ]) + "") + ")");
    }
    if (stackTrace) {
      msg.push("\n");
      if (typeof m != 'undefined' && m !== null) {
        msg.push(m[2]);
      } else {
        msg.push(stack);
      }
    }
    msg.push("\n");
    process.stderr.write(join(' ', msg));
    if (error) {
      code == null && (code = 1);
      process.exit(code);
    }
  }
  Identifier.main = {
    importAll: importAll,
    importKind: importKind,
    shellQuote: shellQuote,
    shellParse: shellParse,
    ord: ord,
    chr: chr,
    bullet: bullet,
    log: log,
    info: info,
    errSet: errSet,
    iwarn: iwarn,
    ierror: ierror,
    warn: warn,
    error: error,
    icomplain: icomplain,
    icomplain1: icomplain1,
    sysSet: sysSet,
    sys: sys,
    sysOk: sysOk,
    getopt: getopt,
    sprintf: sprintf
  };
  Identifier.color = {
    red: red,
    brightRed: brightRed,
    green: green,
    brightGreen: brightGreen,
    yellow: yellow,
    brightYellow: brightYellow,
    blue: blue,
    brightBlue: brightBlue,
    magenta: magenta,
    brightMagenta: brightMagenta,
    cyan: cyan,
    brightCyan: brightCyan
  };
  Identifier.util = {
    mergeObjects: mergeObjects,
    times: times,
    range: range,
    shuffle: shuffle,
    isInt: isInt,
    isInteger: isInteger,
    isPositiveInt: isPositiveInt,
    isNonNegativeInt: isNonNegativeInt,
    isNum: isNum,
    isNumber: isNumber,
    isArray: isArray,
    isArr: isArr,
    isObj: isObj,
    isObject: isObject,
    isStr: isStr,
    isString: isString,
    isBool: isBool,
    isBoolean: isBoolean
  };
  for (_ in Identifier) {
    ident = Identifier[_];
    for (k in ident) {
      v = ident[k];
      module.exports[k] = v;
    }
  }
  function partialize$(f, args, where){
    var context = this;
    return function(){
      var params = slice$.call(arguments), i,
          len = params.length, wlen = where.length,
          ta = args ? args.concat() : [], tw = where ? where.concat() : [];
      for(i = 0; i < len; ++i) { ta[tw[0]] = params[i]; tw.shift(); }
      return len < wlen && len ?
        partialize$.apply(context, [f, ta, tw]) : f.apply(context, ta);
    };
  }
  function repeatString$(str, n){
    for (var r = ''; n > 0; (n >>= 1) && (str += str)) if (n & 1) r += str;
    return r;
  }
}).call(this);
