<template>
<div>
	<header>
	<div class="navbar navbar-expand-lg navbar-light bg-transparent">
	  <div class="container d-flex justify-content-between navbar-nav mr-auto my-4">
	    <a href="/" class="navbar-brand d-flex align-items-center">
	      <img src="/img/logo.svg" width="40px" class="mr-2">
	      <strong translated class="text-uppercase font-ptsn">pixelfed</strong>
	    </a>
	  </div>
	</div>
	</header>
	<div class="container">
		<div class="row mb-3">
			<div class="col-12 py-1 border-bottom d-flex justify-content-between align-items-center">
				<p class="h1 font-weight-light">Instances</p>
				<div class="d-none d-md-block">
					<span class="d-inline-block mr-5 text-center">
						<p class="h3 font-weight-light mb-0">{{formatCount(stats.user_count)}}</p>
						<div class="small text-muted">USERS</div>
					</span>
					<span class="d-inline-block mr-5 text-center">
						<p class="h3 font-weight-light mb-0">{{formatCount(stats.post_count)}}</p>
						<div class="small text-muted">POSTS</div>
					</span>
					<span class="d-inline-block text-center">
						<p class="h3 font-weight-light mb-0">{{formatCount(stats.instance_count)}}</p>
						<div class="small text-muted">INSTANCES</div>
					</span>
				</div>
			</div>
		</div>
		<div v-if="!loaded" class="row pt-3">
			<div class="col-12 py-5">
				<div class="d-flex justify-content-center">
					<div class="spinner-border" role="status">
						<span class="sr-only">Loading...</span>
					</div>
				</div>
			</div>
		</div>
		<div v-else class="row pt-3">
			<div class="col-12 col-md-3">
				<p class="small text-muted font-weight-bold">Filter Results</p>
				<div class="custom-control custom-checkbox mb-2">
					<input type="checkbox" class="custom-control-input" id="customCheck0" v-model="openRegistration">
					<label class="custom-control-label font-weight-bold text-muted" for="customCheck0">Open Registration</label>
				</div>
				<div class="custom-control custom-checkbox mb-2">
					<input type="checkbox" class="custom-control-input" id="customCheck1" v-model="latestVersionOnly">
					<label class="custom-control-label font-weight-bold text-muted" for="customCheck1">Latest Version Only</label>
				</div>
				<div class="custom-control custom-checkbox mb-4">
					<input type="checkbox" class="custom-control-input" id="customCheck2" v-model="allowsVideos">
					<label class="custom-control-label font-weight-bold text-muted" for="customCheck2">Allows Video Uploads</label>
				</div>
				<hr>
				<div class="mb-4">
					<label for="customRange1" class="font-weight-bold text-muted small">Photo Album Limit</label>
					<input type="range" class="custom-range" id="customRange1" step="1" min="1" max="15" v-model="albumSizeRange">
					<p class="small font-weight-bold text-muted">Minimum {{albumSizeRange}} photos allowed</p>
				</div>
				<div class="mb-4">
					<label for="customRange1" class="font-weight-bold text-muted small">Upload Limit</label>
					<input type="range" class="custom-range" id="customRange1" step="5" min="5" max="40" v-model="fileSizeLimit">
					<p class="small font-weight-bold text-muted">Minimum {{fileSizeLimit}} MB upload limit</p>
				</div>
				<p>
					<button type="button" class="btn btn-outline-secondary btn-block font-weight-bold" @click.prevent="applyFilters()">Apply Filters</button>
				</p>	
			</div>
			<div v-if="instances.length" class="col-12 col-md-6 mb-4">
				<div v-for="(instance, index) in instances" class="card rounded-lg bg-white shadow border-0 mb-4">
					<div class="card-body p-0">
						<div class="media">
							<div class="d-none d-md-flex bg-portrait instance-img flex-column justify-content-center align-items-center">
								<div class="text-center">
									<div v-for="(p, i) in instance.timeline" class="d-inline-block m-1 cursor-pointer" @click="redirect(p.url)">
										<div class="square" style="width:75px; height:75px;">
											<div class="square-content" v-bind:style="{ 'background-image': 'url(' + p.thumbnail + ')' }"></div>
										</div>	
									</div>
								</div>
							</div>
							<div class="media-body d-flex flex-column" style="width:100%;height: 280px;">
								<div class="px-3 d-flex flex-grow-1 justify-content-center">
									<p class="h3 align-self-center font-weight-light mb-0">{{instance.domain}}</p>
								</div>
								<div class="px-3 bg-light flex-grow-0 border-top">
									<div class="py-3">
										<p class="text-muted">
											<span v-if="instance.nodeinfo.openRegistrations == true" class="btn btn-outline-success btn-sm py-0 font-weight-bold mr-1">open</span>
											<span v-if="instance.nodeinfo.metadata.config.uploader.album_limit > 1" class="btn btn-outline-secondary btn-sm py-0 font-weight-bold mr-1">albums</span>
											<span v-if="instance.nodeinfo.metadata.config.uploader.media_types.includes('video/mp4')" class="btn btn-outline-secondary btn-sm py-0 font-weight-bold mr-1">video</span>
											<span v-if="instance.nodeinfo.software.version" class="btn btn-outline-secondary btn-sm py-0 font-weight-bold mr-1">v{{instance.nodeinfo.software.version}}</span>
										</p>
										<div class="mb-0 d-flex justify-content-between align-items-center">
											<span>
												<span class="d-inline-block">
													<span class="d-block font-weight-bold lead mb-n2">{{formatCount(instance.user_count)}}</span>
													<span class="text-muted font-weight-bold small text-uppercase">Users</span>
												</span>
												<span class="d-inline-block px-3 px-md-4">
													<span class="d-block font-weight-bold lead mb-n2">{{formatCount(instance.post_count)}}</span>
													<span class="text-muted font-weight-bold small text-uppercase">Posts</span>
												</span>
												<span class="d-inline-block">
													<span class="d-block font-weight-bold lead mb-n2">{{formatCount(instance.nodeinfo.usage.users.activeMonth)}}</span>
													<span class="text-muted font-weight-bold small text-uppercase">MAU</span>
												</span>
											</span>
											<span>
												<a class="btn btn-success font-weight-bold px-4 btn-lg" :href="'/instance/' + instance.domain">View</a>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="col-12 col-md-6">
				<div class="card card-body p-5 text-center">
					<div class="font-weight-bold">No instances found. Please try again later</div>
				</div>
			</div>
			<div class="col-12 col-md-3">
				<p class="d-none justify-content-between align-items-center">
					<a class="btn btn-success btn-sm py-1 font-weight-bold" href="#">Prev Page</a>
					<a class="btn btn-success btn-sm py-1 font-weight-bold" href="#">Next Page</a>
				</p>
				<div class="card card-body mb-3 bg-transparent">
					<p class="text-muted font-weight-bold mb-0 text-center">{{resultCount}} Results Found</p>
					<hr>
					<p class="mb-0"><a class="btn btn-success btn-block font-weight-bold" href="https://socialhub.activitypub.rocks/t/pixelfed-instance-picker-launches-in-open-beta/412">Add Instance</a></p>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script type="text/javascript">
export default {
	data() {
		return {
			page: 1,
			filters: [
				'latestVersion',
				'allowsVideos',
				'adultContent'
			],
			openRegistration: false,
			latestVersionOnly: false,
			allowsVideos: false,
			adultContent: false,
			instances: [],
			albumSizeRange: 3,
			fileSizeLimit: 15,
			searchFilters: [],
			resultCount: 0,
			loaded: false,
			pagination: {
				current_page: 1,
				next_page_url: null,
				prev_page_url: null
			},
			stats: {
				post_count: 0,
				user_count: 0,
				instance_count: 0
			}
		}
	},

	beforeMount() {
		let u = new URLSearchParams(window.location.search);
		if(u.has('page') && u.get('page') > 1) {
			this.page = u.get('page');
		}
		if(u.has('openRegistration') && u.get('openRegistration') == 'true') {
			this.openRegistration = true;
		}
		if(u.has('latestVersionOnly') && u.get('latestVersionOnly') == 'true') {
			this.latestVersionOnly = true;
		}
		if(u.has('allowsVideos') && u.get('allowsVideos') == 'true') {
			this.allowsVideos = true;
		}
		if(u.has('albumSizeRange') && u.get('albumSizeRange') !== 3) {
			this.albumSizeRange = u.get('albumSizeRange');
		}
		if(u.has('fileSizeLimit') && u.get('fileSizeLimit') !== 15) {
			this.fileSizeLimit = u.get('fileSizeLimit');
		}
		axios.get('/api/v1/instances', {
			params: {
				page: this.page,
				openRegistration: this.openRegistration,
				latestVersionOnly: this.latestVersionOnly,
				allowsVideos: this.allowsVideos,
				albumSizeRange: this.albumSizeRange,
				fileSizeLimit: this.fileSizeLimit
			}
		})
		.then(res => {
			this.instances = res.data.data.map(p => {
				p.timeline = {};
				return p;
			});
			this.resultCount = res.data.total;
			this.loaded = true;
			this.fetchInstancePosts();
			this.fetchStats();
		})
		.catch(err => {

		});
	},

	methods: {
		applyFilters() {
			let params = {
				openRegistration: this.openRegistration,
				latestVersionOnly: this.latestVersionOnly,
				allowsVideos: this.allowsVideos,
				albumSizeRange: this.albumSizeRange,
			}

			if(this.fileSizeLimit != 15) {
				params['fileSizeLimit'] = this.fileSizeLimit;
			}

			let query = Object.keys(params).filter(key => params[key]).map(key => key + '=' + params[key]).join('&');

			if(query) {
				window.location.href = '/?' + query;
			} else {
				window.location.href = '/';
			}

		},

		formatCount(val) {
			return App.util.format.count(val);
		},

		formatSize(instance) {
			let count = instance.nodeinfo.metadata.config.uploader.max_photo_size / 1000;
			return count + 'MB';
		},

		fetchInstancePosts() {
			let self = this;
			this.instances.forEach(function(i, k) {
				let domain = i.domain;
				axios.get('/api/v1/instance/' + domain + '/timeline?limit=6')
				.then(res => {
					let data = res.data;
					self.instances[k].timeline = data;
				});
			});
		},

		redirect(url) {
			window.location.href = url;
		},

		fetchStats() {
			axios.get('/api/v1/stats')
			.then(res => {
				this.stats = res.data;
			});
		}
	}
}
</script>