import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

export function Singleton<T>() {
    abstract class Singleton extends Component {
        private static _instance: T = null;
        public static get instance(): T {
            if (!this._instance) {
                console.log(`${this._instance} is null`);
                return;
            }

            return this._instance;
        }

        protected onLoad(): void {
            this.init();
        }
        
        protected init() {
            Singleton._instance = this as unknown as T;
        }

        public term() {
            Singleton._instance = null;
        }

    }

    return Singleton;
}
