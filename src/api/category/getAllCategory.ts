import axiosInstance from "../axios"

export const getAllCategory = (params: {
    categoryName: string,
    page: number | null,
    offset: number | null
}) => {
    const res = axiosInstance.get(`http://localhost:8070/category?${params}`)
    console.log('test', res);
    
    return res
}