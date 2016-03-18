function checkformedia(linkitems,launchUnizp)
{
	for (var myi=0;myi<linkitems.length;myi++)
	{
	    if (myi>0 && linkitems[myi].href==linkitems[myi-1].href)
			continue;
	    var mediaext=linkitems[myi].href.substr(linkitems[myi].href.lastIndexOf('.')+1).toLowerCase();
	    if (mediaext=='m4a')
			mediaext='x-m4a'
	    if (mediaext=='wav' || mediaext=='mp3' || mediaext=='x-m4a' || mediaext=='ogg')
			document.getElementById('previewable-binary-viewer').innerHTML=document.getElementById('previewable-binary-viewer').innerHTML+"<video controls style='width:50%;height:1px;'><source src='"+linkitems[myi].href+"' type='audio/"+mediaext+"'></video>";
	    if (mediaext=='mp4' || mediaext=='ogv' || mediaext=='webm')
			document.getElementById('previewable-binary-viewer').innerHTML=document.getElementById('previewable-binary-viewer').innerHTML+"<video controls style='width:50%;'><source src='"+linkitems[myi].href+"' type='video/"+mediaext+"'></video>";
	    if (mediaext=='zip')
	    {
			if (launchUnizp)
			{
				var script = document.createElement("script");
				script.src = chrome.extension.getURL('zip.js');
				script.onload = function(){loadZip();};
				document.head.appendChild(script);
			}
			else
				return linkitems[myi].href;
	    }
	}
	return "";
}

if (document.getElementById('previewable-binary-viewer')!==null)
{
	checkformedia(document.getElementsByClassName('j-attachment-icon'),true);
	checkformedia(document.querySelectorAll('a[rel]'),true);
}



function loadZip()
{
	var targeturl=checkformedia(document.querySelectorAll('a[rel]'),false);
	if (targeturl=="")
		targeturl=checkformedia(document.getElementsByClassName('j-attachment-icon'),false);
	var script = document.createElement('script');
	script.innerHTML=" \
	var script = document.createElement('script');  \
	script.src = '"+chrome.extension.getURL('inflate.js')+"';  \
	document.head.appendChild(script);  \
	var script = document.createElement('script');  \
	script.src = '"+chrome.extension.getURL('deflate.js')+"';  \
	document.head.appendChild(script);  \
	var script = document.createElement('script');  \
	script.src = '"+chrome.extension.getURL('mime-types.js')+"';  \
	document.head.appendChild(script);  \
	var script = document.createElement('script');  \
	script.src = '"+chrome.extension.getURL('zip-ext.js')+"';  \
	document.head.appendChild(script);  \
	var script = document.createElement('script');  \
	script.src = '"+chrome.extension.getURL('zip-fs.js')+"';  \
	document.head.appendChild(script);  \
	zip.useWebWorkers=false; \
	var zipBox=[];  \
	function getFileType(mediaext)  \
	{  \
		var mediaext=mediaext.substring(mediaext.lastIndexOf('.')+1);  \
		var codelang='download';  \
		if (mediaext=='txt' || mediaext=='html' || mediaext=='htm' || mediaext=='xml' || mediaext=='sh' || mediaext=='json')  \
		  codelang='markup';  \
		if (mediaext=='css')  \
		  codelang='css';  \
		if (mediaext=='c' || mediaext=='cpp' || mediaext=='cs')  \
		  codelang='clike';  \
		if (mediaext=='js')  \
		  codelang='javascript';  \
		if (mediaext=='java')  \
		  codelang='java';  \
		if (mediaext=='php')  \
		  codelang='php';  \
		if (mediaext=='coffee')  \
		  codelang='coffeescript';  \
		if (mediaext=='scss')  \
		  codelang='scss';  \
		if (mediaext=='sh')  \
		  codelang='bash';  \
		if (mediaext=='py')  \
		  codelang='python';  \
		if (mediaext=='groovy' || mediaext=='gvy' || mediaext=='gsh' || mediaext=='gy')  \
		  codelang='groovy';  \
		if (mediaext=='pcap')  \
		  codelang='http';  \
		if (mediaext=='rb')  \
		  codelang='ruby';  \
		if (mediaext=='feature')  \
		  codelang='gherkin';  \
		if (mediaext=='go')  \
		  codelang='go';  \
		if (mediaext=='m4a')  \
		  mediaext=='x-m4a';  \
		if (mediaext=='wav' || mediaext=='mp3' || mediaext=='x-m4a' || mediaext=='ogg' || mediaext=='mp4' || mediaext=='ogv' || mediaext=='webm' || mediaext=='png'|| mediaext=='gif'|| mediaext=='jpg'|| mediaext=='jpeg'|| mediaext=='svg')  \
		  codelang=mediaext;  \
		return codelang;  \
	}  \
	function drawFileList() \
	{  \
		document.getElementById('previewable-binary-viewer').innerHTML='';  \
		if (zipBox.length>1) {  \
			document.getElementById('previewable-binary-viewer').innerHTML='Files Inside:<br />';   \
    	for (var i=0;i<zipBox.length;i++)  \
    		if (zipBox[i].filename.substr(zipBox[i].filename.length-1)!='/')   \
    			document.getElementById('previewable-binary-viewer').innerHTML=document.getElementById('previewable-binary-viewer').innerHTML+'<a href=\"javascript:openFile('+i+');\">'+zipBox[i].filename+'</a><br />';   \
		}  \
	} \
	function showDLlink(ftype,fileNo,mediaext)  \
	{  \
		zipBox[fileNo].getData(new zip.BlobWriter(ftype+'/'+mediaext), function(data) {  \
			drawFileList();   \
        	document.getElementById('previewable-binary-viewer').innerHTML=document.getElementById('previewable-binary-viewer').innerHTML+\"<h2><a download='\"+zipBox[fileNo].filename+\"' href='\"+window.URL.createObjectURL(data)+\"'>Download \"+zipBox[fileNo].filename+\"</a></h2>\";  \
      	});  \
	}   \
	function openFile(fileNo)  \
	{  \
		document.getElementById('previewable-binary-viewer').innerHTML='<img src=\"https://'+window.location.host+'/images/j-loader-large-wht.gif\">';   \
		var mediaext=getFileType(zipBox[fileNo].filename);   \
		if (mediaext=='download')  \
		{  \
			showDLlink('application',fileNo,mediaext);   \
			return; \
		}  \
		if (mediaext=='wav' || mediaext=='mp3' || mediaext=='x-m4a' || mediaext=='ogg' || mediaext=='mp4' || mediaext=='ogv' || mediaext=='webm')  \
		{  \
			showDLlink('video',fileNo,mediaext);   \
			zipBox[fileNo].getData(new zip.BlobWriter('video/'+mediaext), function(data) {  \
	        	document.getElementById('previewable-binary-viewer').innerHTML=document.getElementById('previewable-binary-viewer').innerHTML+\"<video controls style='width:50%;'><source src='\"+window.URL.createObjectURL(data)+\"'; type='video/\"+mediaext+\"'></video>\";  \
	      	});  \
			return;  \
		}  \
		if (mediaext=='png'|| mediaext=='gif'|| mediaext=='jpg'|| mediaext=='jpeg'|| mediaext=='svg')  \
		{  \
			showDLlink('image',fileNo,mediaext);   \
			zipBox[fileNo].getData(new zip.BlobWriter('image/'+mediaext), function(data) {  \
	        	document.getElementById('previewable-binary-viewer').innerHTML=document.getElementById('previewable-binary-viewer').innerHTML+\"<img src='\"+window.URL.createObjectURL(data)+\"'></img>\";  \
	      	});  \
			return;   \
		}  \
		showDLlink('plaintext',fileNo,mediaext);   \
		zipBox[fileNo].getData(new zip.BlobWriter('utf-8'), function(data) {  \
	        var reader2 = new FileReader();  \
	        reader2.onload = function(e) {  \
				var html =\"<html><head><link rel='stylesheet' href='"+chrome.extension.getURL('prism.css')+"'><script src='"+chrome.extension.getURL('prism.js')+"'></\"+\"script></\"+\"head><body><pre class='line-numbers'><code class='language-\"+mediaext+\"'>\"+reader2.result.replace(/</g,'&lt;').replace(/\\n/g, '<br />\\n')+\"</code></pre></\"+\"body>\";  \
				var iframe = document.createElement('iframe');  \
				iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);  \
				document.getElementById('previewable-binary-viewer').width ='10%'; \
				document.getElementById('previewable-binary-viewer').appendChild(iframe);   \
				iframe.width ='100%'; \
				iframe.height='500px'; \
			};   \
	        reader2.readAsText(data);  \
		});  \
	}  \
	var reqeust=new XMLHttpRequest();  \
	reqeust.onreadystatechange=onZipFileLoaded;  \
	reqeust.responseType = 'blob';  \
	document.getElementById('previewable-binary-viewer').innerHTML='<img src=\"https://'+window.location.host+'/images/j-loader-large-wht.gif\">';   \
	reqeust.open('GET','"+targeturl+"');  \
	reqeust.send();  \
	zip.useWebWorkers=false;  \
	function onZipFileLoaded(){  \
		if(reqeust.readyState==4 && reqeust.status==200)  \
			var zipReader=zip.createReader(new zip.BlobReader(reqeust.response),onZipFileOpened);  \
	}  \
	function onZipFileOpened(reader){  \
	    reader.getEntries(function(entries) {  \
	    	zipBox=entries;  \
	    	if (entries.length==1)   \
	    		openFile(0);   \
		    drawFileList();  \
		});  \
	}  \
	";
	document.head.appendChild(script);
}


