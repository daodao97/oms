export interface FormProps {
    prefixPath: string,
    isSub: boolean,
    modelValue: object,
    formItems: any[],
    infoApi: string,
    saveApi: string,
    options: object,
    afterSubmit: string | Function,
    afterReset: string | Function,
    components: object,
    rootData: Function,
    dev: boolean
}

export type Value = string | number

export interface Option {
    value: Value
    label: string
}

export interface Confirm {
    title: string
    message: string
}
export type confirmType = Boolean | Confirm
