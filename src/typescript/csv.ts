export const parse = (input: string[][]): string => {
    let csvContent: string = '';
    let dataString: string = '';
    input.forEach((infoArray, index: number) => {
        dataString = infoArray.join(',');
        csvContent += index < input.length ? dataString + '\n' : dataString;
    });
    return csvContent;
};

export const download = (content: string, fileName: string, mimeType: string): boolean => {
    let a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

    if (navigator.msSaveBlob) { // IE10
        return navigator.msSaveBlob(new Blob([content], {
            type: mimeType
        }), fileName);
    } else if ('download' in a) { //html5 A[download]
        a.href = 'data:' + mimeType + ',' + encodeURIComponent(content);
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        setTimeout(function() {
            a.click();
            document.body.removeChild(a);
        }, 66);
        return true;
    } else { //do iframe dataURL download (old ch+FF):
        let f = document.createElement('iframe');
        document.body.appendChild(f);
        f.src = 'data:' + mimeType + ',' + encodeURIComponent(content);
        setTimeout(() => { document.body.removeChild(f); }, 333);
        return true;
    }
};