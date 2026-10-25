import assert from "node:assert/strict";
const base = process.argv[2] ?? "http://localhost:3005";
for (const route of ["/studio","/studio/tasks","/studio/tasks/new","/studio/projects","/studio/projects/new","/mfa"]) {
  for (const cookie of ["", "sb-atrphakkgpqtoqdigggt-auth-token=invalid-test-cookie"]) {
    const response = await fetch(base + route, { redirect: "manual", headers: cookie ? {cookie} : {} });
    assert.equal(response.status,307,route);
    assert.ok(response.headers.get("location")?.startsWith("/login?next="),route);
    assert.ok(response.headers.get("cache-control")?.includes("no-store"),route);
  }
}
const manifestResponse=await fetch(base+"/manifest.webmanifest");
assert.equal(manifestResponse.status,200);
const manifest=await manifestResponse.json();
assert.equal(manifest.start_url,"/studio");assert.equal(manifest.display,"standalone");
for(const icon of manifest.icons) {
 const response=await fetch(base+icon.src);
 assert.equal(response.status,200,icon.src);assert.ok(response.headers.get("content-type")?.includes("image/png"));
}
const login=await fetch(base+"/login");
assert.equal(login.status,200);assert.ok(login.headers.get("cache-control")?.includes("no-store"));
const crossOriginLogout=await fetch(base+"/auth/logout",{method:"POST",redirect:"manual",headers:{origin:"https://invalid.example"}});
assert.equal(crossOriginLogout.status,403);
console.log("STUDIO_HTTP_OK: anonymous/invalid-cookie guards, no-store, manifest/icons, cross-origin logout rejection");
