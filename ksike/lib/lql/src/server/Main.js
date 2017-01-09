/*
 * @author		Antonio Membrides Espinosa
 * @package    	LQL
 * @created		28/10/2016
 * @updated		28/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class Executor{}
class Processor{}

class LQL
{
     constructor(executor=null, processor=null){
        this.commands = [];
        this.setting(executor, processor);
        this.executor.clear();
        this.processor.clear();
    }
    
    setting(executor = null, processor = null) {
        this.executor = executor ? executor : new Executor();
        this.processor = processor ? processor : new Processor();
    }

    create(executor = null, processor = null) {
        executor = executor ? executor : (static::obj ? static::obj.executor : executor);
        processor = processor ? processor : (static::obj ? static::obj.processor : processor);
        return new static(executor, processor);
    }

    clear() {
        delete this.commands;
        this.commands = [];
        return this;
    }

    compile(force = false) {
        return this.processor.compile(this.commands, force);
    }

    execute(data = false, force = false) {
        data = is_file(data) ? file_get_contents(data) : data;
        return this.executor.execute(
            this.processor
                .setting(data)
                .compile(this.commands, force)
        );
    }

    query(sql = false, force = false) {
        return this.execute(sql, force);
    }

    flush(sql = false, force = false) {
        return this.execute(sql, force);
    }

    persist(sql = false, force = false) {
        return this.execute(sql, force);
    }

    fetchAll(sql = false, force = false) {
        return this.execute(ql, force);
    }

    fetchArray(sql = false, force = false) {
        return this.execute(sql, force);
    }
}
exports.Main = LQL;
exports.Executor = Executor;
exports.Processor = Processor;